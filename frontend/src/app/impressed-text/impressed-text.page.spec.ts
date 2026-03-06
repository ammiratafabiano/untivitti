import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImpressedTextPage } from './impressed-text.page';

describe('ImpressedTextPage', () => {
  let component: ImpressedTextPage;
  let fixture: ComponentFixture<ImpressedTextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpressedTextPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImpressedTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
