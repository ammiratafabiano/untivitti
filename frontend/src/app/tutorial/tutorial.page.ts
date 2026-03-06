import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GameTypeEnum } from '../models/game.model';
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
    const game = this.navParams.get('game');
    this.setTutorial(type, game);
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  setTutorial(type: TutorialTypeEnum, game: GameTypeEnum) {
    const tutorialList = this.getTutorialList();
    this.data = tutorialList.find(x => x.type === type && x.game === game);
  }

  getTutorialList() {
    const list: TutorialModel[] = [
      {
        type: TutorialTypeEnum.HomePage,
        game: 0,
        title: 'Pagina iniziale',
        subtitle: 'Qui saranno elencate e spiegate le operazioni che si possono fare all\'interno della pagina iniziale.',
        sections: [
          {
            title: 'Nickname',
            items: [
              {
                title: 'E\' necessario per partecipare ad una partita già creata o per crearne una nuova.',
                img: './assets/tutorial/nickname.png'
              },
              {
                title: 'Input "Nickname"',
                subtitle: 'Qui deve essere insertito il nickname che si vuole usare. Esso rimarrà salvato nel browser per accessi successivi.',
                icon: 'text-outline'
              }
            ]
          },
          {
            title: 'Partecipa',
            items: [
              {
                title: 'Questa sezione permette di accedere ad una partita esistente.',
                img: './assets/tutorial/join.png'
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
                img: './assets/tutorial/create.png'
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
                title: 'Input "Monete"',
                subtitle: 'Qui si sceglie se voler giocare tenendo il conto delle monete e quante usarne.',
                icon: 'server-outline'
              },
              {
                title: 'Bottone "Crea"',
                subtitle: 'Consente di creare una partita con le impostazioni scelte.',
                icon: 'arrow-forward-circle-outline'
              }
            ]
          },
          {
            title: 'Sessione',
            items: [
              {
                title: 'E\' possibile rientrare in una partita qualora si sia usciti per errore.',
                img: './assets/tutorial/session.png'
              },
              {
                title: 'Bottone "Continua"',
                subtitle: 'Consente di continuare la partita salvata in sessione.',
                icon: 'alert-circle-outline'
              },
              {
                title: 'Bottone "x"',
                subtitle: 'Consente di terminare la partita salvata in sessione.',
                icon: 'close'
              }
            ]
          }
        ]
      },
      {
        type: TutorialTypeEnum.GamePage,
        game: 0,
        title: 'Pagina di gioco',
        subtitle: 'In questa pagina si effettuano principalmente le mosse del gioco.',
        sections: [
          {
            title: 'Informazioni generali',
            items: [
              {
                title: 'Nella parte superiore ci sono diversi bottoni e indicatori utili al gioco.',
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
                title: 'Bottone giocatori',
                subtitle: 'Consente di entrare all\'interno della pagina di riepilogo. Vi è inoltre un indicatore della quantità di giocatori attivi.',
                icon: 'people-outline'
              },
              {
                title: 'Indicatore monete',
                subtitle: 'Indica la quantità di monete disponibili.',
                icon: 'server-outline'
              },
              {
                title: 'Bottone messaggio di testo',
                subtitle: 'Consente di mandare un messaggio testuale visibile a tutti i giocatori.',
                icon: 'chatbubble-ellipses-outline'
              }
            ]
          },
          {
            title: 'Riepilogo mosse',
            items: [
              {
                title: 'In questa sezione viene visualizzata un panoramica delle ultime due mosse avvenute.',
                img: './assets/tutorial/players-board.png'
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
                img: './assets/tutorial/move-button.png'
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
                title: 'Questa sezione permette al mazziere di eseguire operazioni preliminari. E\' necessario cliccare il bottone della mossa per effettuarla.',
                img: './assets/tutorial/admin-moves-start.png'
              },
              {
                title: 'Bottone "Distribuisci"',
                subtitle: 'Consente di distribuire le carte ai giocatori.',
                icon: 'albums-outline',
                rotateIcon: true
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
                subtitle: 'Se questa mossa viene fatta durante il gioco consente di ritirare le carte dei giocatori nel caso succeda un errore. Quando invece viene fatta alla fine del turno consente di ritirare le carte e di automaticamente passare il mazzo al giocatore attivo successivo.',
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
        game: 0,
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
                title: 'In questa sezione vi è la possibilità di vedere e condividere le informazioni della partita.',
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
              },
              {
                title: 'Mazzo partita',
                subtitle: 'E\' il nome del mazzo usato in partita.',
                icon: 'albums-outline',
                rotateIcon: true
              }
            ]
          },
          {
            title: 'Azioni giocatore',
            items: [
              {
                title: 'Fuori dal gioco è possibile cambiare il proprio stato (spettatore/giocatore).',
                img: './assets/tutorial/players-actions.png'
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
                title: 'E\' possibile cambiare la quantità delle proprie monete disponibili ma anche quella degli altri giocatori.',
                img: './assets/tutorial/players-balance-update.png'
              },
              {
                title: 'E\' possibile cambiare l\'ordine dei giocatori nella lista.',
                img: './assets/tutorial/players-update.png'
              }
            ]
          },
          {
            title: 'Pagamento',
            items: [
              {
                title: 'Nel caso di scelta di partita con uso di monete è importante che vengano effettuati i pagamenti virtuali prima di cominciare un nuovo turno. Per pagare basta cliccare sul tasto "Paga" nella pagina di riepilogo giocatori.',
                img: './assets/tutorial/payment.png'
              }
            ]
          },
        ]
      },
      {
        type: TutorialTypeEnum.HomePage,
        game: 1,
        title: 'Pagina iniziale',
        subtitle: 'Qui saranno elencate e spiegate le operazioni che si possono fare all\'interno della pagina iniziale.',
        sections: [
          {
            title: 'Nickname',
            items: [
              {
                title: 'E\' necessario per partecipare ad una partita già creata o per crearne una nuova.',
                img: './assets/tutorial/nickname.png'
              },
              {
                title: 'Input "Nickname"',
                subtitle: 'Qui deve essere insertito il nickname che si vuole usare. Esso rimarrà salvato nel browser per accessi successivi.',
                icon: 'text-outline'
              }
            ]
          },
          {
            title: 'Partecipa',
            items: [
              {
                title: 'Questa sezione permette di accedere ad una partita esistente.',
                img: './assets/tutorial/join.png'
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
                img: './assets/tutorial/create.png'
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
                title: 'Input "Monete"',
                subtitle: 'Qui si sceglie se voler giocare tenendo il conto delle monete e quante usarne.',
                icon: 'server-outline'
              },
              {
                title: 'Bottone "Crea"',
                subtitle: 'Consente di creare una partita con le impostazioni scelte.',
                icon: 'arrow-forward-circle-outline'
              }
            ]
          },
          {
            title: 'Sessione',
            items: [
              {
                title: 'E\' possibile rientrare in una partita qualora si sia usciti per errore.',
                img: './assets/tutorial/session.png'
              },
              {
                title: 'Bottone "Continua"',
                subtitle: 'Consente di continuare la partita salvata in sessione.',
                icon: 'alert-circle-outline'
              },
              {
                title: 'Bottone "x"',
                subtitle: 'Consente di terminare la partita salvata in sessione.',
                icon: 'close'
              }
            ]
          }
        ]
      },
      {
        type: TutorialTypeEnum.GamePage,
        game: 1,
        title: 'Pagina di gioco',
        subtitle: 'In questa pagina si effettuano principalmente le mosse del gioco.',
        sections: [
          {
            title: 'Informazioni generali',
            items: [
              {
                title: 'Nella parte superiore ci sono diversi bottoni e indicatori utili al gioco.',
                img: './assets/tutorial/game-header-1.png'
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
                title: 'Bottone giocatori',
                subtitle: 'Consente di entrare all\'interno della pagina di riepilogo. Vi è inoltre un indicatore della quantità di giocatori attivi.',
                icon: 'people-outline'
              },
              {
                title: 'Indicatore monete',
                subtitle: 'Indica la quantità di monete disponibili. Prima di inizare il turno è possibile cliccarlo per scegliere la puntata.',
                icon: 'server-outline'
              },
              {
                title: 'Bottone messaggio di testo',
                subtitle: 'Consente di mandare un messaggio testuale visibile ai giocatori. Quando il suo colore è nero (bianco in dark mode) è possibile mandare un messaggio solo ai membri del team. Fuori dal turno i messaggi sono per tutti.',
                icon: 'chatbubble-ellipses-outline'
              }
            ]
          },
          {
            title: 'Carta',
            items: [
              {
                title: 'Durante il gioco nella parte centrale si trovano le vostre carta.',
                img: './assets/tutorial/cards-1.png'
              }
            ]
          },
          {
            title: 'Bottone di azione',
            items: [
              {
                title: 'Consente di effettuare le mosse. Queste cambieranno se il giocatore è il mazziere.',
                img: './assets/tutorial/move-button-1.png'
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
                img: './assets/tutorial/notifications-1.png'
              }
            ]
          },
          {
            title: 'Mano che nasconde',
            items: [
              {
                title: 'E\' possibile trascinare una mano per nascondere le carte ai compagni di squadra e creare suspance.',
                img: './assets/tutorial/hiding-hand.png'
              }
            ]
          },
          {
            title: 'Mosse giocatore',
            items: [
              {
                title: 'Questa sezione permette al giocatore di eseguire le mosse in partita. E\' necessario cliccare il bottone della mossa per effettuarla. Se questo è trasparente significa che è in quel momento non è possibile effettuare quella mossa.',
                img: './assets/tutorial/player-moves-1.png'
              },
              {
                title: 'Bottone "Chiusi"',
                subtitle: 'Consente di votare per la chiusura.',
                icon: 'thumbs-up-outline'
              },{
                title: 'Bottone "Aperti"',
                subtitle: 'Consente di voltare per l\'apertura.',
                icon: 'thumbs-down-outline'
              },
            ]
          },
          {
            title: 'Mosse mazziere fuori dal gioco',
            items: [
              {
                title: 'Questa sezione permette al mazziere di eseguire operazioni preliminari. E\' necessario cliccare il bottone della mossa per effettuarla.',
                img: './assets/tutorial/admin-moves-start.png'
              },
              {
                title: 'Bottone "Distribuisci"',
                subtitle: 'Consente di distribuire le carte ai giocatori.',
                icon: 'albums-outline',
                rotateIcon: true
              }
            ]
          },
          {
            title: 'Mosse mazziere durante il gioco',
            items: [
              {
                title: 'Questa sezione permette al mazziere di eseguire operazioni e mosse in partita.',
                img: './assets/tutorial/admin-moves-game-1.png'
              },
              {
                title: 'Bottone "Dai carta"',
                subtitle: 'Consente di dare la carta ai giocatori che si dichiarano aperti.',
                icon: 'albums-outline',
                rotateIcon: true
              },
              {
                title: 'Bottone "Ritira"',
                subtitle: 'Se questa mossa viene fatta durante il gioco consente di ritirare le carte dei giocatori nel caso succeda un errore. Quando invece viene fatta alla fine del turno consente di ritirare le carte e di automaticamente passare il mazzo al giocatore attivo successivo.',
                icon: 'download-outline'
              }
            ]
          }
        ]
      },
      {
        type: TutorialTypeEnum.PlayersPage,
        game: 1,
        title: 'Pagina di riepilogo',
        subtitle: 'Qui saranno elencate e spiegate le operazioni che si possono fare all\'interno della pagina di riepilogo.',
        sections: [
          {
            title: 'Lista giocatori',
            items: [
              {
                title: 'In questa sezione si possono vedere i giocatori connessi, il loro stato e le loro carte in tempo reale. La riga del giocatore che deve fare la sua mossa è evidenziato con il colore rosa.',
                img: './assets/tutorial/players-list-1.png'
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
                subtitle: 'Indica la quantità di monete disponibili del giocatore. Durante il turno il totale viene sostituito dalla puntata.',
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
                title: 'In questa sezione vi è la possibilità di vedere e condividere le informazioni della partita.',
                img: './assets/tutorial/players-sharing-1.png'
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
              },
              {
                title: 'Mazzo partita',
                subtitle: 'E\' il nome del mazzo usato in partita.',
                icon: 'albums-outline',
                rotateIcon: true
              }
            ]
          },
          {
            title: 'Azioni giocatore',
            items: [
              {
                title: 'Fuori dal gioco è possibile cambiare il proprio stato (spettatore/giocatore).',
                img: './assets/tutorial/players-actions.png'
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
                title: 'E\' possibile cambiare la quantità delle proprie monete disponibili ma anche quella degli altri giocatori.',
                img: './assets/tutorial/players-balance-update.png'
              },
              {
                title: 'E\' possibile cambiare l\'ordine dei giocatori nella lista.',
                img: './assets/tutorial/players-update.png'
              }
            ]
          },
          {
            title: 'Pagamento',
            items: [
              {
                title: 'E\' importante che il banco effettui i pagamenti virtuali prima di cominciare un nuovo turno. Per pagare/ritirare basta cliccare sul tasto "Paga"/"Ritira" nella pagina di riepilogo giocatori.',
                img: './assets/tutorial/payment-1.png'
              }
            ]
          },
        ]
      }
    ];
    return list;
  }

}
