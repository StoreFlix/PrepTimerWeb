import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCondimentComponent } from './add-condiment.component';

describe('AddCondimentComponent', () => {
  let component: AddCondimentComponent;
  let fixture: ComponentFixture<AddCondimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCondimentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCondimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
