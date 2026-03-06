import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationController, ModalController, NavParams } from '@ionic/angular';
import { ImpressedTextModel } from '../models/impressed-text.model';

@Component({
  selector: 'app-impressed-text',
  templateUrl: './impressed-text.page.html',
  styleUrls: ['./impressed-text.page.scss'],
})
export class ImpressedTextPage implements OnInit, AfterViewInit {

  @ViewChild('text') text: ElementRef;

  msg: ImpressedTextModel;
  showClose = false;

  constructor(
    private animationCtrl: AnimationController,
    public navParams: NavParams,
    private modalController: ModalController) {
    this.msg = this.navParams.get('msg');
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
        this.showClose = true;
      }).play();
    }).play();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
