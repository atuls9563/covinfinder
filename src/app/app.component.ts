import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../app/services/api.service'
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private toasterService: ToasterService;

  title = 'cowinfinder';
  cowinResult = [];
  loader = false;
  submitted = false;
  searchedDate = '';
  states: any;
  cities: any;
  searchBy = 2;
  state: any;
  city: any;
  calander:any=[];

   months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  constructor(private apiService: ApiService, toasterService: ToasterService) {
    this.toasterService = toasterService;
    this.apiService.getStates().subscribe(data => {
      this.states = data.states;
      console.log(this.states);
      this.setAvailCal();
    })
  }


  ngOnInit() {

  }

  setAvailCal(){
    let that = this;
    const currentDate =  new Date().getDate();
    const currentMonth = this.months[new Date().getMonth()]
    const lastDate = currentDate+6;
    for(var i=currentDate; i < lastDate+1; i++){
        let calObj:any = i + ' ' +currentMonth ;
      that.calander.push(calObj)
    }

    console.log(this.calander);
  }
  search: OperatorFunction<string, readonly {}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.states.filter((v: any) => v['state_name'].toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: { state_name: string }) => x.state_name;

  searchCity: OperatorFunction<string, readonly {}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.cities.filter((v: any) => v['district_name'].toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  cityFormatter = (x: { district_name: string }) => x.district_name;


  searchForm = new FormGroup({
    pinCode: new FormControl(''),
    date: new FormControl(''),
  });

  onStateChange(item: any) {
    item.preventDefault();
    this.state = item.item;

    this.apiService.getCities(this.state.state_id).subscribe(data => {
      this.cities = data.districts;
      console.log(this.cities);
    })
   
  }
  onCityChange(item: any) {
    item.preventDefault();
    this.city = item.item;

   
  }


  searchBydist(){
    this.loader = true;
    const that = this;
    console.log(this.searchForm);
    this.submitted = true;
    if (!this.state) {
      this.loader = false;
      return;
    }


    if (!this.city) {
      this.loader = false;
      return;
    }

    if (!this.searchForm.value.date || this.searchForm.value.date == '') {
      this.loader = false;
      return;
    }

    const dateString = `${this.searchForm.value.date.day}-${this.searchForm.value.date.month}-${this.searchForm.value.date.year}`

    const req = {
      district_id: this.city.district_id,
      date: dateString
    }

    this.apiService.getSlotsByDist(req).subscribe(response => {

      if (response && response.centers) {
        this.cowinResult = response.centers;

        this.cowinResult.sort((t:any,n:any)=>t['name'].toLowerCase() > n.name.toLowerCase() ? 1 : n.name.toLowerCase() > t.name.toLowerCase() ? -1 : 0)

        this.submitted = false;
        setTimeout(function () {
          that.loader = false;
        }, 800)

        console.log(' this.cowinResult',  this.cowinResult)
      }

    })
  }

  searchBypin(){
    this.loader = true;
    const that = this;
    console.log(this.searchForm);
    this.submitted = true;
    if (!this.searchForm.value.pinCode || this.searchForm.value.pinCode == '') {
      this.toasterService.pop('success', 'Args Title', 'Args Body');
      this.loader = false;
      return;
    }

    if (!this.searchForm.value.date || this.searchForm.value.date == '') {
      this.toasterService.pop('success', 'Args Title', 'Args Body');
      this.loader = false;
      return;
    }

    const dateString = `${this.searchForm.value.date.day}-${this.searchForm.value.date.month}-${this.searchForm.value.date.year}`

    const req = {
      pin: this.searchForm.value.pinCode,
      date: dateString
    }

    this.apiService.getSlots(req).subscribe(response => {

      if (response && response.sessions) {
        this.cowinResult = response.sessions;
        this.submitted = false;
        setTimeout(function () {
          that.loader = false;
        }, 800)
      }

    })
  }
  
  findCowin() {
    if(this.searchBy == 1){
      this.searchBypin();
    }
    else if(this.searchBy == 2){
      this.searchBydist();
    }
  }
}
