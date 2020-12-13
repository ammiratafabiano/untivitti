!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function n(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{ekgB:function(t,i,r){"use strict";r.r(i),r.d(i,"GamePageModule",(function(){return G}));var a,o=r("ofXK"),c=r("3Pt+"),s=r("TEn/"),b=r("tyNb"),u=r("mrSG"),l=r("2Vo4"),f=r("nYR2"),d=r("HM5V"),v=r("SAsG"),h=r("fXoL"),m=r("H+bZ"),p=r("OC8m"),y=((a=function(){function t(){e(this,t),this.endpoint="ws://2.238.108.96:3000"}return n(t,[{key:"initWebSocket",value:function(e,t){return this.websocket=new WebSocket(this.endpoint),this.subscribeUpdate(t.name,e.code),this.stateListener=new l.a(e),this.stateListener}},{key:"subscribeUpdate",value:function(e,t){var n=this;this.websocket.onopen=function(){n.websocket.send(JSON.stringify({type:"init",nick:e,code:t})),n.websocket.onmessage=function(e){var t=JSON.parse(e.data);switch(t.type){case"init":n.uuid=t.uuid;break;case"update":n.stateListener.next(t.state);break;case"move":break;default:n.stateListener.next(void 0),console.log(t)}},n.websocket.onclose=function(){n.stateListener.next(void 0)}}}},{key:"sendMove",value:function(e){this.websocket&&this.websocket.send(JSON.stringify({type:"move",uuid:this.uuid,move:e}))}},{key:"closeWebSocket",value:function(){this.websocket&&this.websocket.close()}}]),t}()).\u0275fac=function(e){return new(e||a)},a.\u0275prov=h.Db({token:a,factory:a.\u0275fac,providedIn:"root"}),a);function g(e,t){if(1&e){var n=h.Nb();h.Kb(0),h.Mb(1,"ion-icon",13),h.Ub("click",(function(){return h.ec(n),h.Wb().openPlayersModal()})),h.Lb(),h.Mb(2,"ion-badge",14),h.Ub("click",(function(){return h.ec(n),h.Wb().openPlayersModal()})),h.ic(3),h.Lb(),h.Jb()}if(2&e){var i=h.Wb();h.xb(3),h.kc(" ",i.state.players.length," ")}}function M(e,t){if(1&e&&(h.Mb(0,"ion-chip",15),h.Ib(1,"ion-icon",16),h.Mb(2,"ion-label"),h.ic(3),h.Lb(),h.Lb()),2&e){var n=h.Wb();h.xb(3),h.jc(n.currentPlayer.balance)}}function k(e,t){if(1&e&&(h.Mb(0,"div",17),h.Mb(1,"div",18),h.Ib(2,"img",19),h.Lb(),h.Lb()),2&e){var n=h.Wb();h.xb(2),h.ac("src","./assets/cardSets/",n.state.cardSet,"/",n.currentPlayer.cards[0],".png",h.fc)}}function P(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",24),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[0])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[0].name)}}function x(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",24),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[1])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[1].name)}}function L(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",26),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[2])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[2].name)}}function w(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",27),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[3])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[3].name)}}function S(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",28),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[4])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[4].name)}}function W(e,t){if(1&e&&(h.Kb(0),h.hc(1,P,3,1,"ion-fab-list",20),h.hc(2,x,3,1,"ion-fab-list",20),h.hc(3,L,3,1,"ion-fab-list",21),h.hc(4,w,3,1,"ion-fab-list",22),h.hc(5,S,3,1,"ion-fab-list",23),h.Jb()),2&e){var n=h.Wb();h.xb(1),h.Zb("ngIf",!n.state.status),h.xb(1),h.Zb("ngIf",n.state.status),h.xb(1),h.Zb("ngIf",n.currentPlayer.moves.length>2),h.xb(1),h.Zb("ngIf",n.currentPlayer.moves.length>3),h.xb(1),h.Zb("ngIf",n.currentPlayer.moves.length>4)}}function I(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",26),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[0])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[0].name)}}function O(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",27),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[1])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[1].name)}}function N(e,t){if(1&e){var n=h.Nb();h.Mb(0,"ion-fab-list",28),h.Mb(1,"ion-fab-button",25),h.Ub("click",(function(){h.ec(n);var e=h.Wb(2);return e.sendMove(e.currentPlayer.moves[2])})),h.ic(2),h.Lb(),h.Lb()}if(2&e){var i=h.Wb(2);h.xb(2),h.jc(i.currentPlayer.moves[2].name)}}function C(e,t){if(1&e&&(h.Kb(0),h.hc(1,I,3,1,"ion-fab-list",21),h.hc(2,O,3,1,"ion-fab-list",22),h.hc(3,N,3,1,"ion-fab-list",23),h.Jb()),2&e){var n=h.Wb();h.xb(1),h.Zb("ngIf",n.currentPlayer.moves.length>0),h.xb(1),h.Zb("ngIf",n.currentPlayer.moves.length>1),h.xb(1),h.Zb("ngIf",n.currentPlayer.moves.length>2)}}var j,Z,U,A=[{path:"",component:(j=function(){function t(n,i,r,a,o,c,s,b){e(this,t),this.route=n,this.router=i,this.api=r,this.modalController=a,this.alertController=o,this.notificationService=c,this.popoverController=s,this.updateStateService=b}return n(t,[{key:"ngOnInit",value:function(){var e=this;this.route.queryParams.subscribe((function(t){t&&t.group&&t.player?(e.state=JSON.parse(t.group),e.stateListener=new l.a(e.state),e.currentPlayer=JSON.parse(t.player),e.currentGame=JSON.parse(t.game)):e.exitGame(),e.notificationService.enableNotifications(),e.initUpdateService()}))}},{key:"initUpdateService",value:function(){var e=this;this.updateStateService.initWebSocket(this.state,this.currentPlayer).subscribe((function(t){t?(e.prevState=e.state,e.state=t,e.stateListener.next(e.state),e.currentPlayer=e.state.players.find((function(t){return t.name===e.currentPlayer.name})),e.checkNotifications(),e.updateTitle()):e.exitGame()}))}},{key:"updateTitle",value:function(){if(this.state)if(!1===this.state.status)this.title=this.state.players.length>1?"Partita in pausa":"In attesa...";else{var e=this.state.players.find((function(e){return!0===e.canMove}));this.title=e?this.currentPlayer.canMove?"E' il tuo turno!":"E' il turno di "+e.name:"Giro terminato"}}},{key:"confirmExit",value:function(){return Object(u.a)(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.alertController.create({header:"Aspetta!",message:"Sei proprio sicuro di volere uscire?",buttons:[{text:"Annulla",role:"cancel"},{text:"Si",handler:function(){n.exitGame()}}]});case 2:return t=e.sent,e.next=5,t.present();case 5:case"end":return e.stop()}}),e,this)})))}},{key:"exitGame",value:function(){var e=this;this.playerModal&&this.playerModal.dismiss(),this.updateStateService.closeWebSocket(),this.api.exitGroup(this.currentPlayer.name,this.state.code).pipe(Object(f.a)((function(){return e.router.navigate(["/"])}))).subscribe()}},{key:"isAdmin",value:function(){var e=this;if(this.state)return this.state.players.find((function(t){return t.name===e.currentPlayer.name})).isAdmin}},{key:"openPlayersModal",value:function(){return Object(u.a)(this,void 0,void 0,regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.modalController.create({component:v.a,componentProps:{state:this.stateListener,nickname:this.currentPlayer.name}});case 2:return this.playerModal=e.sent,e.next=5,this.playerModal.present();case 5:case"end":return e.stop()}}),e,this)})))}},{key:"checkNotifications",value:function(){var e=this,t=this.state.players,n=this.prevState.players,i=this.state.players.find((function(e){return!0===e.isAdmin})).name,r=this.prevState.players.find((function(e){return!0===e.isAdmin})).name;t.forEach((function(t){var i=!1;n.forEach((function(e){t.name===e.name&&(i=!0)})),i||e.notificationService.addNotification(t.name+" si \xe8 connesso/a",d.a.Login)})),n.forEach((function(n){var i=!1;t.forEach((function(e){e.name===n.name&&(i=!0)})),i||e.notificationService.addNotification(n.name+" si \xe8 disconnesso/a",d.a.Logout)})),i!==r&&this.notificationService.addNotification(i+" \xe8 il nuovo mazziere",d.a.Logout)}},{key:"sendMove",value:function(e){this.updateStateService.sendMove(e.id)}}]),t}(),j.\u0275fac=function(e){return new(e||j)(h.Hb(b.a),h.Hb(b.g),h.Hb(m.a),h.Hb(s.F),h.Hb(s.a),h.Hb(p.a),h.Hb(s.I),h.Hb(y))},j.\u0275cmp=h.Bb({type:j,selectors:[["app-game"]],decls:17,vars:9,consts:[[3,"translucent"],["lines","none"],["name","arrow-back-circle-outline","color","danger",3,"click"],["mode","md"],[4,"ngIf"],[3,"fullscreen"],[1,"cards-area"],[1,"other-cards-container"],["class","my-balance","outline","",4,"ngIf"],["class","cards-container",4,"ngIf"],["horizontal","center","slot","fixed",1,"action-button"],["color","warning",3,"disabled"],["name","caret-up-outline"],["name","people-outline",3,"click"],["color","success","slot","end",3,"click"],["outline","",1,"my-balance"],["name","server","color","warning"],[1,"cards-container"],[1,"card"],[3,"src"],["side","top",4,"ngIf"],["side","bottom",4,"ngIf"],["side","start",4,"ngIf"],["side","end",4,"ngIf"],["side","top"],[1,"fab",3,"click"],["side","bottom"],["side","start"],["side","end"]],template:function(e,t){1&e&&(h.Mb(0,"ion-header",0),h.Mb(1,"ion-toolbar"),h.Mb(2,"ion-item",1),h.Mb(3,"ion-icon",2),h.Ub("click",(function(){return t.confirmExit()})),h.Lb(),h.Mb(4,"ion-title",3),h.ic(5),h.Lb(),h.hc(6,g,4,1,"ng-container",4),h.Lb(),h.Lb(),h.Lb(),h.Mb(7,"ion-content",5),h.Mb(8,"div",6),h.Mb(9,"div",7),h.hc(10,M,4,1,"ion-chip",8),h.Lb(),h.hc(11,k,3,2,"div",9),h.Lb(),h.Mb(12,"ion-fab",10),h.Mb(13,"ion-fab-button",11),h.Ib(14,"ion-icon",12),h.Lb(),h.hc(15,W,6,5,"ng-container",4),h.hc(16,C,4,3,"ng-container",4),h.Lb(),h.Lb()),2&e&&(h.Zb("translucent",!0),h.xb(5),h.jc(t.title),h.xb(1),h.Zb("ngIf",t.state&&t.state.players),h.xb(1),h.Zb("fullscreen",!0),h.xb(3),h.Zb("ngIf",t.state.money),h.xb(1),h.Zb("ngIf",t.currentPlayer.cards.length>0),h.xb(2),h.Zb("disabled",!((t.currentPlayer.isAdmin||!t.currentPlayer.isAdmin&&t.currentPlayer.canMove)&&t.state.players.length>=t.currentGame.minPlayers)),h.xb(2),h.Zb("ngIf",t.currentPlayer.isAdmin),h.xb(1),h.Zb("ngIf",!t.currentPlayer.isAdmin))},directives:[s.l,s.C,s.o,s.m,s.A,o.j,s.h,s.i,s.j,s.d,s.g,s.s,s.k],styles:[".fab[_ngcontent-%COMP%]{width:15vw!important;height:15vw!important}.cards-container[_ngcontent-%COMP%]{width:100%;height:60%;text-align:center}.other-cards-container[_ngcontent-%COMP%]{height:40%}.card[_ngcontent-%COMP%], .card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%}.card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border:.05px solid #d3d3d3;border-radius:5vw;box-shadow:0 5px 20px 0 #d3d3d3;filter:contrast(1.2)}.cards-area[_ngcontent-%COMP%]{height:60%}.action-button[_ngcontent-%COMP%]{bottom:25vw}.my-balance[_ngcontent-%COMP%]{position:absolute;top:16vw;right:2vw}"]}),j)}],E=((U=function t(){e(this,t)}).\u0275mod=h.Fb({type:U}),U.\u0275inj=h.Eb({factory:function(e){return new(e||U)},imports:[[b.i.forChild(A)],b.i]}),U),G=((Z=function t(){e(this,t)}).\u0275mod=h.Fb({type:Z}),Z.\u0275inj=h.Eb({factory:function(e){return new(e||Z)},imports:[[o.b,c.a,s.D,E]]}),Z)}}])}();