import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InvestService } from './invest.service';
import { UseGuards } from '@nestjs/common';
//import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class InvestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<number, Socket> = new Map();

  constructor(
    private readonly investService: InvestService,
    private readonly jwtService: JwtService,
  ) {
    // Her 5 saniyede bir getiri hesaplaması yapıp client'lara gönderelim
    setInterval(() => {
      this.broadcastInvestmentReturns();
    }, 5000);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      console.log('************************Client connected:', client.id);
      console.log('************************Token:', token);
      const payload = await this.jwtService.verifyAsync(token);
      console.log('************************Payload:', payload);
      const userId = payload.userId;
      //const userId = 11;
      console.log('************************UserId:', userId);

      this.clients.set(userId, client);

      // Bağlantı kurulduğunda ilk getiri bilgisini gönderelim
      const returns = await this.investService.calculateReturns(userId);
      console.log('************************Returns:', returns);
      client.emit('investmentReturns', returns);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Client'ı map'ten kaldır
    for (const [userId, socket] of this.clients.entries()) {
      if (socket === client) {
        this.clients.delete(userId);
        break;
      }
    }
  }

  private async broadcastInvestmentReturns() {
    for (const [userId, client] of this.clients.entries()) {
      try {
        const returns = await this.investService.calculateReturns(userId);
        client.emit('investmentReturns', returns);
      } catch (error) {
        console.error(`Error calculating returns for user ${userId}:`, error);
      }
    }
  }
}
