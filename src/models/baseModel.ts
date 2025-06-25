import { v4 as uuidv4 } from "uuid";
import { BaseEntity } from "../types/common";

export abstract class BaseModel {
  protected data: Map<string, BaseEntity> = new Map();

  protected generateId(): string {
    return uuidv4();
  }

  protected getTimestamp(): Date {
    return new Date();
  }

  async findAll(): Promise<BaseEntity[]> {
    return Array.from(this.data.values());
  }

  async findById(id: string): Promise<BaseEntity | null> {
    return this.data.get(id) || null;
  }

  async create(
    itemData: Omit<BaseEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<BaseEntity> {
    const id = this.generateId();
    const now = this.getTimestamp();

    const newItem = {
      ...itemData,
      id,
      createdAt: now,
      updatedAt: now,
    } as BaseEntity;

    this.data.set(id, newItem);
    return newItem;
  }

  async update(
    id: string,
    updates: Partial<Omit<BaseEntity, "id" | "createdAt">>
  ): Promise<BaseEntity | null> {
    const existing = this.data.get(id);
    if (!existing) return null;

    const updatedItem = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
      updatedAt: this.getTimestamp(),
    } as BaseEntity;

    this.data.set(id, updatedItem);
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async count(): Promise<number> {
    return this.data.size;
  }
}
