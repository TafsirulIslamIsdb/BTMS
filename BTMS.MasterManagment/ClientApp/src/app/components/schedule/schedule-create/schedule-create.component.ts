import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusRoute } from 'src/app/models/data/bus-route';
import { Bus } from 'src/app/models/data/bus.model';
import { Company } from 'src/app/models/data/company-model';
import { Schedule } from 'src/app/models/data/schedule';
import { ScheduleViewModel } from 'src/app/models/viewmodels/schedule-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BusRouteService } from 'src/app/services/data/bus-route.service';
import { BusService } from 'src/app/services/data/bus.service';
import { CompanyService } from 'src/app/services/data/company.service';
import { ScheduleService } from 'src/app/services/data/schedule.service';
import { AppConstants } from 'src/app/shared/app-constants';

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent implements OnInit {
  //data form dropdown
  company!:Company;
  buses:Bus[] =[];
  busRoutes:BusRoute[] =[]
  //model
  scheduleVM:ScheduleViewModel= { 
    scheduleId:undefined, 
    journeyDate:undefined, 
    departureTime:undefined, 
    minTimeToReportBeforeDeparture:undefined,
    fareAmount:undefined,
    busRoute:'',
    bus:'',
    busId:undefined,
    busRouteId:undefined
  };
  schedule!:Schedule;
  createForm:FormGroup = new FormGroup({
    journeyDate:new FormControl(undefined, Validators.required), 
    departureTime:new FormControl(undefined, Validators.required), 
    minTimeToReportBeforeDeparture:new FormControl(30, Validators.required),
    fareAmount:new FormControl(undefined, Validators.required),
   
    busId:new FormControl(undefined, Validators.required),
    busRouteId:new FormControl(undefined, Validators.required),
    test: new FormControl(undefined)
  });
  constructor(
    private scheduleService:ScheduleService,
    private notifyService:NotifyService,
    private companyService:CompanyService,
    public busService:BusService,
    private busRouteService:BusRouteService,
    private datePipe:DatePipe
  ) { }
  //mathods
  loadDropDownData(){
    this.busService.getOfCompany(Number(this.company.companyId))
    .subscribe({
      next:r=>{
        this.buses=r;
      },
      error:err=>{
        this.notifyService.fail("Failed to load bus data", "DISMISS");
      }
    });
    this.busRouteService.get()
    .subscribe({
      next:r=>{
        this.busRoutes = r;
      },
      error:err=>{
        this.notifyService.fail("Failed to load route data", "DISMISS");
      }
    })
  }
  //handlers
  save(){
    if(this.createForm.invalid) return;
    console.log(this.createForm.value);
  }
  ngOnInit(): void {
    this.companyService.getByKey(AppConstants.accessKey)
    .subscribe({
      next:r=>{
        this.company = r;
        this.loadDropDownData();
      },
      error:err=>{
        this.notifyService.fail("Failed to load company data", "DISMISS");
      }
    });
    
  }

}
