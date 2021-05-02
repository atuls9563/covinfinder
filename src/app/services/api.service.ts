import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
    
   }

   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
   PIN_URL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin';
  DIST_SEARCH_URL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict'
  STATE_API = 'https://cdn-api.co-vin.in/api/v2/admin/location/states';
  DIST_API = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/'

  public getSlots(req:any):Observable<any> {
    return this.http.get(this.PIN_URL+'?pincode='+req.pin+'&date='+req.date)
   }

   public getSlotsByDist(req:any):Observable<any> {
    return this.http.get(this.DIST_SEARCH_URL+'?district_id='+req.district_id+'&date='+req.date)
   }

   public getStates():Observable<any> {
    return this.http.get(this.STATE_API); 
   }
   public getCities(stateId:any):Observable<any> {
    return this.http.get(this.DIST_API+stateId); 
   }
}
