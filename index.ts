import {
  ConnectionOptions,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';


@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => Child, child => child.parent)
  children!: Child[];
}

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Parent, p => p.children)
  parent!: Parent;
}

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./db.sqlite`,
  entities: [Parent, Child],
  logging: true,
  synchronize: true
};

async function main() {
  const connection = await createConnection(options);

  const childRepo = connection.getRepository(Child);
  childRepo.save(new Child())

  const children = await childRepo.find();
  console.log(children);
}

main().catch(console.error);
