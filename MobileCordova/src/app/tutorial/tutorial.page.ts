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
    const list: TutorialModel[] = [
      {
        type: TutorialTypeEnum.HomePage,
        title: 'Pagina iniziale',
        subtitle: 'Qui saranno elencate e spiegate le operazioni che si possono fare all\'interno della pagina iniziale.',
        sections: [
          {
            title: 'Partecipa',
            items: [
              {
                title: 'Questa sezione permette di accedere ad una partita esistente.',
                img: './assets/tutorial/partecipa.png'
              },
              {
                title: 'Input "Codice"',
                subtitle: 'Qui deve essere inserito il codice di una partita esistente. Se si accede tramite link di invito questo campo verrà riempito automaticamente.',
                icon: 'link-outline'
              },
              {
                title: 'Bottone "Partecipa"',
                subtitle: 'Consente di accedere ad una partita il cui codice inserito corrisponde ad una partita che non è cominciata e che esiste.',
                icon: 'arrow-forward-circle-outline'
              }
            ]
          },
          {
            title: 'Crea',
            items: [
              {
                title: 'Questa sezione permette di creare una nuova partita.',
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
                subtitle: 'Consente di creare una partita con le impostazioni scelte.',
                icon: 'arrow-forward-outline'
              }
            ]
          }
        ]
      },
      {
        type: TutorialTypeEnum.GamePage,
        title: 'Pagina di gioco',
        subtitle: 'In questa pagina si effettuano principalmente le mosse del gioco.',
        sections: [
          {
            title: 'Informazioni generali',
            items: [
              {
                title: 'Nella parte superiore ci sono diversi indicatori utili al gioco.',
                img: './assets/tutorial/game-header.png'
              },
              {
                title: 'Bottone "Uscita"',
                subtitle: 'Consente all\'utente di uscire dal gioco. Comparirà un messaggio di conferma prima di lasciare definitivamente la sessione.',
                icon: 'arrow-back-circle-outline'
              },
              {
                title: 'Bottone "Giocatori"',
                subtitle: 'Consente di entrare all\'interno della pagina di riepilogo.',
                icon: 'people-outline'
              },
              {
                title: 'Indicatore "Numero giocatori"',
                subtitle: 'Posto accanto al bottone "Giocatori", indica la quantità di giocatori online.',
                icon: 'alert-circle-outline'
              },
              {
                title: 'Indicatore "Monete"',
                subtitle: 'Indica la quantità di monete rimaste.',
                icon: 'server-outline'
              },
              {
                title: 'Durante il gioco nella parte centrale si trova la vostra carta.',
                img: './assets/tutorial/cards.png'
              }
            ]
          },
          {
            title: 'Mosse giocatore',
            items: [
              {
                title: 'Questa sezione permette al giocatore di eseguire le mosse in partita.',
                img: './assets/tutorial/player-moves.png'
              },
              {
                title: 'Bottone "Mi sto"',
                subtitle: 'Consente di effettuare la mossa "Mi sto".',
                icon: 'thumbs-up-outline'
              },
              {
                title: 'Bottone "Cucù"',
                subtitle: 'Consente di effettuare la mossa "Cucù".',
                icon: 'hand-left-outline'
              },              {
                title: 'Bottone "Cambio"',
                subtitle: 'Consente di effettuare la mossa "Cambio".',
                icon: 'repeat-outline'
              }
            ]
          },
          {
            title: 'Mosse Cartante fuori dal gioco',
            items: [
              {
                title: 'Questa sezione permette al cartante di eseguire operazioni preliminari.',
                img: './assets/tutorial/admin-moves-start.png'
              },
              {
                title: 'Bottone "Distribuisci"',
                subtitle: 'Consente di distribuire le carte ai giocatori.',
                icon: 'share-outline'
              },
              {
                title: 'Bottone "Passa il mazzo"',
                subtitle: 'Consente di passare il mazzo al giocatore successivo.',
                icon: 'albums-outline'
              }
            ]
          },
          {
            title: 'Mosse Cartante durante il gioco',
            items: [
              {
                title: 'Questa sezione permette al cartante di eseguire operazioni e mosse in partita.',
                img: './assets/tutorial/admin-moves-game.png'
              },
              {
                title: 'Bottone "Ritira"',
                subtitle: 'Consente di ritirare le carte dei giocatori.',
                icon: 'download-outline'
              },
              {
                title: 'Bottone "Mi sto"',
                subtitle: 'Consente di effettuare la mossa "Mi sto".',
                icon: 'thumbs-up-outline'
              },
              {
                title: 'Bottone "Cucù"',
                subtitle: 'Consente di effettuare la mossa "Cucù".',
                icon: 'hand-left-outline'
              },
              {
                title: 'Bottone "Cambio"',
                subtitle: 'Consente di effettuare la mossa "Cambio".',
                icon: 'repeat-outline'
              }
            ]
          }
        ]
      }
    ];
    return list;
  }

}
