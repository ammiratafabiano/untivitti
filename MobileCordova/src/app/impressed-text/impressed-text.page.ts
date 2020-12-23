import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-impressed-text',
  templateUrl: './impressed-text.page.html',
  styleUrls: ['./impressed-text.page.scss'],
})
export class ImpressedTextPage implements OnInit, AfterViewInit {

  @ViewChild('text') text: ElementRef;

  output: string;

  constructor(
    private animationCtrl: AnimationController,
    public navParams: NavParams) {
    this.output = this.navParams.get('text');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.animationCtrl.create()
    .addElement(this.text.nativeElement)
    .duration(500)
    .fromTo('transform', 'scale(0.5)', 'scale(1.2)')
    .onFinish(() => {
      this.animationCtrl.create()
      .addElement(this.text.nativeElement)
      .duration(100)
      .fromTo('transform', 'scale(1.2)', 'scale(1)')
      .onFinish(() => {
  
      }).play();
    }).play();
  }

}
