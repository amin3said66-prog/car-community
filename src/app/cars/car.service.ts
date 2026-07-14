import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import { Car } from "../models/car.model";
import { MOCK_CARS } from "../data/mock-cars";

@Injectable({ providedIn: 'root' })
export class CarService {
  private baseUrl = environment.apiUrl + '/cars';
  private cars$ = new BehaviorSubject<Car[]>(MOCK_CARS);

  constructor(private http: HttpClient) {}

  /**
   * Get all cars with optional filtering
   */
  getAll(filters?: Partial<Car>): Observable<Car[]> {
    const cars = this.cars$.value;
    
    if (!filters) {
      return of(cars);
    }

    const filtered = cars.filter(car => {
      return Object.keys(filters).every(key => 
        (filters as any)[key] === undefined || car[key as keyof Car] === (filters as any)[key]
      );
    });
    
    return of(filtered);
  }

  /**
   * Get car by ID
   */
  getById(id: string): Observable<Car> {
    const car = this.cars$.value.find(c => c.id === id);
    return of(car!) ;
  }

  /**
   * Search cars by make, model, or color
   */
  searchCars(query: string): Observable<Car[]> {
    const results = this.cars$.value.filter(car =>
      car.make.toLowerCase().includes(query.toLowerCase()) ||
      car.model.toLowerCase().includes(query.toLowerCase()) ||
      car.color.toLowerCase().includes(query.toLowerCase())
    );
    return of(results);
  }

  /**
   * Filter cars by price range
   */
  filterByPrice(minPrice: number, maxPrice: number): Observable<Car[]> {
    const filtered = this.cars$.value.filter(car =>
      car.price >= minPrice && car.price <= maxPrice
    );
    return of(filtered);
  }

  /**
   * Filter cars by fuel type
   */
  filterByFuelType(fuelType: string): Observable<Car[]> {
    const filtered = this.cars$.value.filter(car =>
      car.fuelType === fuelType
    );
    return of(filtered);
  }

  /**
   * Get featured cars
   */
  getFeaturedCars(): Observable<Car[]> {
    const featured = this.cars$.value.filter(car => car.featured === true);
    return of(featured);
  }

  /**
   * Create new car (mock)
   */
  create(data: Car): Observable<Car> {
    const newCar: Car = {
      ...data,
      id: `car-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const currentCars = this.cars$.value;
    this.cars$.next([...currentCars, newCar]);
    return of(newCar);
  }

  /**
   * Update car (mock)
   */
  update(id: string, data: Partial<Car>): Observable<Car> {
    const currentCars = this.cars$.value;
    const index = currentCars.findIndex(c => c.id === id);
    
    if (index > -1) {
      const updatedCar: Car = {
        ...currentCars[index],
        ...data,
        updatedAt: new Date(),
      };
      currentCars[index] = updatedCar;
      this.cars$.next([...currentCars]);
      return of(updatedCar);
    }
    
    return of(data as Car);
  }

  /**
   * Delete car (mock)
   */
  delete(id: string): Observable<void> {
    const currentCars = this.cars$.value;
    this.cars$.next(currentCars.filter(c => c.id !== id));
    return of(void 0);
  }

  /**
   * Get cars by owner
   */
  getCarsByOwner(ownerId: string): Observable<Car[]> {
    const ownerCars = this.cars$.value.filter(car => car.ownerId === ownerId);
    return of(ownerCars);
  }
}
