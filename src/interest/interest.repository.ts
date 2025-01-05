import { EntityRepository, Repository } from 'typeorm';
import { Interest } from '../entities/interest.entity';

@EntityRepository(Interest)
export class InterestRepository extends Repository<Interest> {}
