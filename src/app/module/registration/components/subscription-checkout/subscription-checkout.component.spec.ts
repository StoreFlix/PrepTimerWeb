import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCheckoutComponent } from './subscription-checkout.component';

describe('SubscriptionCheckoutComponent', () => {
  let component: SubscriptionCheckoutComponent;
  let fixture: ComponentFixture<SubscriptionCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
