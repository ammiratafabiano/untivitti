import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TutorialModel, TutorialTypeEnum } from '../models/tutorial.model';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  data: TutorialModel;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams) {
    const type = this.navParams.get('type');
    this.setTutorial(type);
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  setTutorial(type: TutorialTypeEnum) {
    const tutorialList = this.getTutorialList();
    this.data = tutorialList.find(x => x.type === type);
  }

  getTutorialList() {
    let list: TutorialModel[] = [];
    list.push({
      type: TutorialTypeEnum.HomePage,
      title: 'Home Page',
      subtitle: 'Qui saranno elencate e spiegate le operazioni che si possono fare all\'interno della home.',
      sections: [
        {
          title: 'Partecipa',
          items: [
            {
              title: 'Questa sezione ti permette di accedere ad una partita esistente.',
              img: './assets/tutorial/partecipa.png'
            },
            {
              title: 'Input "Codice"',
              subtitle: 'Qui deve essere inserito il codice di una partita esistente. Se si accede tramite link di invito questo campo verrà riempito automaticamente.',
              icon: 'link-outline'
            },
            {
              title: 'Bottone "Partecipa"',
              subtitle: 'Ti consente di accedere ad una partita il cui codice inserito corrisponde ad una partita che non è cominciata e che esiste.',
              icon: 'arrow-forward-circle-outline'
            }
          ]
        },
        {
          title: 'Crea',
          items: [
            {
              title: 'Questa sezione ti permette di creare una nuova partita.',
              img: './assets/tutorial/crea.png'
            },
            {
              title: 'Input "Set di carte"',
              subtitle: 'Qui si sceglie il set di carte che si vuole usare nel gioco che si vuole fare con il gruppo da creare.',
              icon: 'albums-outline'
            },
            {
              title: 'Input "Gioco"',
              subtitle: 'Qui si sceglie il tipo di gioco che si vuole fare con il gruppo da creare.',
              icon: 'dice-outline'
            },
            {
              title: 'Input "Soldi"',
              subtitle: 'Qui si sceglie se voler giocare tenendo il conto dei soldi.',
              icon: 'server-outline'
            },
            {
              title: 'Bottone "Crea"',
              subtitle: 'Ti consente di creare una partita con le impostazioni scelte.',
              icon: 'arrow-forward-outline'
            }
          ]
        }
      ]
    });
    return list;
  }

}
