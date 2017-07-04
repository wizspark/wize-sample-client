import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySelectorComponent } from './query-selector.component';

describe('FormControlComponent', () => {
  let component: QuerySelectorComponent;
  let fixture: ComponentFixture<QuerySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
