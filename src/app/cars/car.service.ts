import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Car } from '../models/car.model';
import { MOCK_CARS } from '../data/mock-cars';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly cars$ = new BehaviorSubject<Car[]>(MOCK_CARS);

  getAll(filters?: Partial<Car>): Observable<Car[]> {
    const cars = this.cars$.value;

    if (!filters) {
      return of(cars);
    }

    const filtered = cars.filter(car =>
      (Object.keys(filters) as (keyof Car)[]).every(
        key => filters[key] === undefined || car[key] === filters[key]
      )
    );

    return of(filtered);
  }

  getById(id: string): Observable<Car | undefined> {
    return of(this.cars$.value.find(c => c.id === id));
  }

  searchCars(query: string): Observable<Car[]> {
    const q = query.toLowerCase();
    const results = this.cars$.value.filter(
      car =>
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.color.toLowerCase().includes(q)
    );
    return of(results);
  }

  filterByPrice(minPrice: number, maxPrice: number): Observable<Car[]> {
    return of(this.cars$.value.filter(c => c.price >= minPrice && c.price <= maxPrice));
  }

  filterByFuelType(fuelType: string): Observable<Car[]> {
    return of(this.cars$.value.filter(c => c.fuelType === fuelType));
  }

  getFeaturedCars(): Observable<Car[]> {
    return of(this.cars$.value.filter(c => c.featured === true));
  }

  create(data: Car): Observable<Car> {
    const newCar: Car = { ...data, id: `car-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
    this.cars$.next([...this.cars$.value, newCar]);
    return of(newCar);
  }

  update(id: string, data: Partial<Car>): Observable<Car | undefined> {
    const cars = this.cars$.value;
    const index = cars.findIndex(c => c.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updatedCar: Car = { ...cars[index], ...data, updatedAt: new Date() };
    const updated = [...cars];
    updated[index] = updatedCar;
    this.cars$.next(updated);
    return of(updatedCar);
  }

  delete(id: string): Observable<void> {
    this.cars$.next(this.cars$.value.filter(c => c.id !== id));
    return of(undefined);
  }

  getCarsByOwner(ownerId: string): Observable<Car[]> {
    return of(this.cars$.value.filter(c => c.ownerId === ownerId));
  }
}
