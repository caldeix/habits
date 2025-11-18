export class PlayerEntity {
  constructor(
    public id: string,
    public name: string,
    public level: number,
    public totalXp: number,
    public coins: number,
    public avatar: string,
    public createdAt: Date
  ) {}

  setName(name: string): PlayerEntity {
    return new PlayerEntity(
      this.id,
      name,
      this.level,
      this.totalXp,
      this.coins,
      this.avatar,
      this.createdAt
    )
  }

  setAvatar(avatar: string): PlayerEntity {
    return new PlayerEntity(
      this.id,
      this.name,
      this.level,
      this.totalXp,
      this.coins,
      avatar,
      this.createdAt
    )
  }
}
