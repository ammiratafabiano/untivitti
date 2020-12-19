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
                icon: 'arrow-forward-circle-outline'
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
                title: 'Bottone di uscita',
                subtitle: 'Consente all\'utente di uscire dal gioco. Comparirà un messaggio di conferma prima di lasciare definitivamente la sessione.',
                icon: 'arrow-back-circle-outline'
              },
              {
                title: 'Stato della partita',
                subtitle: 'Indica con un testo sintetico lo stato della partita o il giocatore che deve fare la sua mossa.',
                icon: 'alert-circle-outline'
              },
              {
                title: 'Bottone lista giocatori',
                subtitle: 'Consente di entrare all\'interno della pagina di riepilogo.',
                icon: 'people-outline'
              },
              {
                title: 'Indicatore numero giocatori"',
                subtitle: 'Posto accanto al bottone lista giocatori, indica la quantità di giocatori online.',
                icon: 'alert-circle-outline'
              },
              {
                title: 'Indicatore monete',
                subtitle: 'Indica la quantità di monete disponibili.',
                icon: 'server-outline'
              }
            ]
          },
          {
            title: 'Carta',
            items: [
              {
                title: 'Durante il gioco nella parte centrale si trova la vostra carta.',
                img: './assets/tutorial/cards.png'
              }
            ]
          },
          {
            title: 'Bottone di azione',
            items: [
              {
                title: 'Consente di effettuare le mosse. Queste cambieranno se il giocatore è il mazziere.',
                img: './assets/tutorial/notifications.png'
              },
              {
                title: 'Attenzione',
                subtitle: 'Non sarà possibile eseguire azioni quando non ci sono abbastanza giocatori attivi o se, nel caso di partita con monete, deve essere ancora effettuato un pagamento.',
                icon: 'alert-circle-outline'
              }
            ]
          },
          {
            title: 'Notifiche',
            items: [
              {
                title: 'Durante la partita, e non solo, compariranno delle notifiche in basso per comunicazioni generali o per avvisare il giocatore di operazioni effettuate dal mazziere o da altri partecipanti.',
                img: './assets/tutorial/notifications.png'
              }
            ]
          },
          {
            title: 'Mosse giocatore',
            items: [
              {
                title: 'Questa sezione permette al giocatore di eseguire le mosse in partita. E\' necessario cliccare il bottone della mossa per effettuarla. Se questo è trasparente significa che è in quel momento non è possibile effettuare quella mossa.',
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
            title: 'Mosse mazziere fuori dal gioco',
            items: [
              {
                title: 'Questa sezione permette al mazziere di eseguire operazioni preliminari. E\' necessario cliccare il bottone della mossa per effettuarla. Se questo è trasparente significa che in quel momento non è possibile effettuare quella mossa.',
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
            title: 'Mosse mazziere durante il gioco',
            items: [
              {
                title: 'Questa sezione permette al mazziere di eseguire operazioni e mosse in partita.',
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
      },
      {
        type: TutorialTypeEnum.PlayersPage,
        title: 'Pagina di riepilogo',
        subtitle: 'Qui saranno elencate e spiegate le operazioni che si possono fare all\'interno della pagina di riepilogo.',
        sections: [
          {
            title: 'Lista giocatori',
            items: [
              {
                title: 'In questa sezione si possono vedere i giocatori connessi, il loro stato e le loro carte in tempo reale. La riga del giocatore che deve fare la sua mossa è evidenziato con il colore rosa.',
                img: './assets/tutorial/players-list.png'
              },
              {
                title: 'Sezione nickname',
                subtitle: 'Contiene il nome del giocatore nella lista. Nel caso sia il tuo, il testo è in grassetto.',
                icon: 'person-outline'
              },
              {
                title: 'Sezione carte',
                subtitle: 'Contiene la carta del giocatore, qualora essa sia visibile. Nel caso di carta pescata, nella riga del mazziere vi è anche la carta pescata.',
                icon: 'tablet-portrait-outline'
              },
              {
                title: 'Indicatore monete',
                subtitle: 'Indica la quantità di monete disponibili del giocatore.',
                icon: 'server-outline'
              },
              {
                title: 'Indicatore mazziere',
                subtitle: 'Indica che il giocatore è il mazziere del giro in corso.',
                icon: 'albums-outline',
                rotateIcon: true
              }
            ]
          },
          {
            title: 'Condivisione',
            items: [
              {
                title: 'In questa sezione vi è la possibilità di avere e condividere le informazioni della partita.',
                img: './assets/tutorial/players-sharing.png'
              },
              {
                title: 'Link di invito amici',
                subtitle: 'Consente all\'utente di generare un link da inviare agli amici per consentire loro di accedere senza la fatica di scrivere il codice della partita manualmente.',
                icon: 'link-outline'
              },
              {
                title: 'Codice partita',
                subtitle: 'E\' il codice univoco della partita che identifica univocamente il gioco con le persone presenti.',
                icon: 'alert-circle-outline'
              }
            ]
          },
          {
            title: 'Azioni giocatore',
            items: [
              {
                title: 'Fuori dal gioco è possibile cambiare il proprio stato (spettatore/giocatore).',
                img: './assets/tutorial/players-actions.png'
              },
              {
                title: 'E\' anche possibile cambiare la quantità delle proprie monete disponibili.',
                img: './assets/tutorial/players-balance-update.png'
              }
            ]
          },
          {
            title: 'Azioni mazziere',
            items: [
              {
                title: 'Fuori dal gioco è possibile cambiare il proprio stato (spettatore/giocatore) ma anche quello degli altri giocatori. Può inoltre essere rimosso un membro dal gruppo.',
                img: './assets/tutorial/players-admin-actions.png'
              },
              {
                title: 'E\' anche possibile cambiare la quantità delle proprie monete disponibili ma anche quella degli altri giocatori.',
                img: './assets/tutorial/players-balance-update.png'
              }
            ]
          }
        ]
      }
    ];
    return list;
  }

}
