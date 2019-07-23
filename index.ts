import {
  ConnectionOptions,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';

@Entity()
class Child1 extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Child2, c => c.child1s)
  child2!: Child2;

  @ManyToOne(type => Parent, p => p.child1s)
  p!: Parent;
}

@Entity()
class Parent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => Child1, c => c.p, {cascade: true})
  child1s!: Child1[];
}

@Entity()
class Child2 extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => Child1, c => c.child2)
  child1s!: Child1[];
}

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./db.sqlite`,
  entities: [Parent, Child1, Child2],
  logging: true,
  synchronize: true,
};

async function main() {
  const connection = await createConnection(options);
  const p = new Parent();
  p.child1s = [Child1.create()]; // Cild1.cild2が空のManyToOne
  await p.save();
}

main().catch(console.error);
