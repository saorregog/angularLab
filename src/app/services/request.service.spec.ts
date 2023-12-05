import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// SERVICES
import { RequestService } from './request.service';
import { InitService } from './init.service';

// MODELS
import { Autocomplete } from '../models/autocomplete.model';
import { RequestType } from '../models/request.model';
import { DailyData, MonthlyData } from '../models/data.model';

fdescribe('Tests for RequestService', () => {
  let requestService: RequestService;
  let initService: InitService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService, InitService],
    });
    requestService = TestBed.inject(RequestService);
    initService = TestBed.inject(InitService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(requestService).toBeTruthy();
  });

  it('should returns the best-matching symbols for autocomplete in an array of objects', (doneFn) => {
    // ARRANGE
    let type: RequestType = 'autocomplete';
    let symbol: string = 'IBM';
    let mockData: Autocomplete = initService.autoCompleteDataInit;

    // ACT
    requestService.getData(type, symbol).subscribe({
      // ASSERT
      next: (data: any) => {
        expect(data).toEqual(mockData);
        doneFn();
      },
    });

    // HTTP CONFIG
    let url =
      'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' +
      symbol +
      '&apikey=CVD6RIZEJX8IILY3';
    let req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should returns the daily price data for a symbol in an object of objects', (doneFn) => {
    // ARRANGE
    let type: RequestType = 'daily';
    let symbol: string = 'IBM';
    let mockData: DailyData = initService.dailyDataInit;

    // ACT
    requestService.getData(type, symbol).subscribe({
      // ASSERT
      next: (data: any) => {
        expect(data).toEqual(mockData);
        doneFn();
      },
    });

    // HTTP CONFIG
    let url =
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' +
      symbol +
      '&apikey=CVD6RIZEJX8IILY3';
    let req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should returns the monthly price data for a symbol in an object of objects', (doneFn) => {
    // ARRANGE
    let type: RequestType = 'monthly';
    let symbol: string = 'IBM';
    let mockData: MonthlyData = initService.monthlyDataInit;

    // ACT
    requestService.getData(type, symbol).subscribe({
      // ASSERT
      next: (data: any) => {
        expect(data).toEqual(mockData);
        doneFn();
      },
    });

    // HTTP CONFIG
    let url =
      'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=' +
      symbol +
      '&apikey=CVD6RIZEJX8IILY3';
    let req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });
});
