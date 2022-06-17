import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServerRate } from 'src/typedefs';
import { CurrencyRateService } from '../currency-rate.service';

enum DealTypes {
  Buy = 'Buy',
  Sell = 'Sell',
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {
  form: FormGroup;

  uah: FormControl;

  usd: FormControl;

  dealType: FormControl;

  private subscription?: Subscription;

  serverRate: ServerRate = {
    ccy: 'USD',
    buy: 1,
    sale: 1,
  };

  readonly dealTypes = [
    {
      value: DealTypes.Sell,
      label: DealTypes.Sell,
    },
    {
      value: DealTypes.Buy,
      label: DealTypes.Buy,
    },
  ];

  constructor(
    private ratesService: CurrencyRateService,
  ) {
    this.uah = new FormControl(0);
    this.usd = new FormControl(0);
    this.dealType = new FormControl(DealTypes.Sell);

    this.uah.touched

    this.form = new FormGroup({
      uah: this.uah,
      usd: this.usd,
      dealType: this.dealType,
    });
  }

  ngOnInit(): void {
    this.ratesService.getRate('USD')
      .subscribe((serverRate) => {
        this.serverRate = serverRate;
      });

    this.subscription = this.form.valueChanges
      .subscribe((values) => {
        console.log(values);
      });

    this.dealType.valueChanges
      .subscribe(() => this.changeUAH());
  }

  changeUSD() {
    const rate = this.dealType.value === DealTypes.Sell
      ? this.serverRate.buy
      : this.serverRate.sale;

    this.usd.setValue(this.uah.value / rate);
  }

  changeUAH() {
    const rate = this.dealType.value === DealTypes.Sell
      ? this.serverRate.buy
      : this.serverRate.sale;

    this.uah.setValue(this.usd.value * rate);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
