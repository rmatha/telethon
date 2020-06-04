<template>
    <Page class="page" actionBarHidden="true">
	  <DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<StackLayout row="1" col="0" colSpan="3">
				<GridLayout rows="auto" columns="*, auto">
					<Label row="0" col="0" class="titleResultat" text="Moyenne de l'équipe" />
				</GridLayout>
				<Button class="boutonAction" v-if="isClassement" text="Afficher les Scores de l'équipe" @tap="changeClassementView"/>
				<Button class="boutonAction" v-else text="Afficher le classement de l'équipe" @tap="changeClassementView"/>
				<StackLayout v-if="!isClassement">
					
					<Label  class="moyenneResultat" :text="moyenne" />
					<Label class="label" text="Moyenne par défi" />
					<FlexboxLayout flexDirection="column">
						<GridLayout rows="30" columns="*" v-for="(moyenne, index) in moyenneDefi" :key="index">
							<Label class="ml20" :text="textMoyenneDefi(moyenne)" />
						</GridLayout>
					</FlexboxLayout>
					
					<Label class="label" text="Moyenne par participant" />
					<FlexboxLayout flexDirection="column">
						<GridLayout rows="30" columns="*" v-for="(moyenne, index) in moyenneProfil" :key="index">
							<Label class="ml20" :text="textMoyenneProfil(moyenne)" />
						</GridLayout>
					</FlexboxLayout>
				</StackLayout>
				<StackLayout v-else>
					<StackLayout v-if="isConnected">
						<GridLayout rows="auto" columns="*,50" >
							<Label col="0" text="Pensez à enregistrer votre équipe pour voir votre classement" textWrap="true"/>
							<Image col="1" class="actionButton" src="~/assets/icons/save.png" @tap="uploadEquipe"/>
						</GridLayout>
						<Label class="label" text="Classement sur la commune" />
						<FlexboxLayout flexDirection="column">
							<GridLayout rows="30" columns="*,50" v-for="(classement, index) in classementCommune" :key="index">
								<Label class="ml20" col="0" :text="classementNom(classement,index)" />
								<Label col="1" :text="classementMoyenne(classement)" />
							</GridLayout>
						</FlexboxLayout>
						<Label class="label" text="Classement sur le département" />
						<FlexboxLayout flexDirection="column">
							<GridLayout rows="30" columns="*,50" v-for="(classement, index) in classementDepartement" :key="index">
								<Label class="ml20" col="0" :text="classementNom(classement,index)" />
								<Label col="1" :text="classementMoyenne(classement)" />
							</GridLayout>
						</FlexboxLayout>
					</StackLayout>
					<StackLayout v-else>
						<Label  class="moyenneResultat" text="Pas de connexion"/>
						<Label text="Une connexion internet est nécessaire pour afficher le classement" />
					</StackLayout>
				</StackLayout>
			</StackLayout>
		</StackLayout>
		</DockLayout>
	</page>
	
	
</template>

<script>
	import affichageDefi from "../defi/affichageDefi";
	import axios from 'axios';
	import equipe from "../equipe/equipe"
	const connectivity = require("connectivity");
	

export default {
		computed: {
			
        },
        props: [],
		data() {
            return {
				moyenne : 0,
				moyenneDefi : [],
				moyenneProfil : [],
				isClassement : false,
				isConnected : false,
				classementCommune : [],
				classementDepartement : [],
            }
        },
		mounted() {
			//console.log("lancement des resultats");
			this.rafraichir();
			
			
        },
		methods: {
			classementMoyenne(classement) {
				return classement.moyenne.substring(0,5);
			},
			classementNom(classement,index) {
				return (index+1)+" - "+classement.nom + " ("+classement.nombre+" scores )";
			},
			changeClassementView() {
				this.isClassement = !this.isClassement;
			},
			textMoyenneDefi(moyenne) {
				return "le Défi '"+moyenne.nomDefi+"' a une moyenne de "+moyenne.moyenne;
			},
			textMoyenneProfil(moyenne) {
				return "'"+moyenne.nomProfil+"' a une moyenne de "+moyenne.moyenne;
			},
			rafraichir() {
				// reinitialisation de la moyenne
				this.moyenneProfil = [];
				this.moyenneDefi = [];
				
				// récupération des scores de l'équipe 
				if (this.$store.state.selectedEquipe.scores) {
					//console.log("Contenu des scores : "+JSON.stringify(this.$store.state.selectedEquipe.scores));
					//console.log("Contenu des scores : "+this.$store.state.selectedEquipe.scores.length);
					if (this.$store.state.selectedEquipe.scores.length == 0) {
						//console.log("pas de score");
						this.moyenne = "Pas de score !";
					}
					else {
						//console.log("Calcul de la moyenne : "+JSON.stringify(this.$store.state.selectedEquipe.scores));
						this.moyenne = _.round(_.meanBy(this.$store.state.selectedEquipe.scores, 'score'),2);
					}
					// calcul des moyennes par défi
					var scoreByDefi = _.groupBy(this.$store.state.selectedEquipe.scores,"defi.nom");
					//console.log(JSON.stringify(scoreByDefi));
					//console.log("--------------------------");
					_.forEach(scoreByDefi, function(scoreTemp,nomDefi) {
						//console.log("RESULTAT : scoreByDefi : "+JSON.stringify(scoreTemp));
						//console.log("RESULTAT : nomDefi : "+nomDefi);
						var scores = _.round(_.map(scoreTemp,"score"),2);
						var moyenneTemp = _.round(_.meanBy(scoreTemp, 'score'),2);
						// récupération du nom du défi 
						this.moyenneDefi.push({ nomDefi: nomDefi, moyenne : moyenneTemp});
					}.bind(this));
					// calcul des moyennes par participant
					var scoreByPart = _.groupBy(this.$store.state.selectedEquipe.scores,"participant.nom");
					//console.log(JSON.stringify(scoreByPart));
					//console.log("--------------------------");
					_.forEach(scoreByPart, function(scoreTemp,participant) {
						//console.log("participant : "+participant.nom+" enregistrements : "+JSON.stringify(scoreTemp));
						var scores = _.round(_.map(scoreTemp,"score"),2);
						//console.log("scores : "+JSON.stringify(scores));
						var moyenneTemp = _.round(_.meanBy(scoreTemp, 'score'),2);
						//console.log("moyenne : "+moyenneTemp);
						this.moyenneProfil.push({ nomProfil:participant, moyenne : moyenneTemp});
					}.bind(this));
				}
				// vérification de la connexion internet 
				//console.log("RESULTAT : monted : v&rification de la connexion internet");
				const connectionType = connectivity.getConnectionType();
				if (connectionType !== connectivity.connectionType.none) {
					this.isConnected = true;
					//console.log("RESULTAT : monted : connexion internet ok");
					// on peut récupérer le classement de la commune
					let params = {};
					params["commune"] = this.$store.state.selectedEquipe.commune;
					axios
						.get('https://telethon2020.citeyen.com/api/score/list', {params : params})
						.then(response => {
							//console.log("RESULTAT : monted : aPPEL AXIOS ok");
							this.classementCommune = response.data;
							//console.log("RESULTAT : monted : ClassementCommune : "+JSON.stringify(this.classementCommune));
						});
					// on peut récupérer le classement du departement
					axios
						.get('https://telethon2020.citeyen.com/api/score/departement')
						.then(response => {
							//console.log("RESULTAT : monted : aPPEL AXIOS bis ok");
							this.classementDepartement = response.data;
							//console.log("RESULTAT : monted : classementDepartement : "+JSON.stringify(this.classementDepartement));
						});
				}
				else {
					this.isConnected = false;
				}
			},
			
			uploadEquipe() {
				confirm({
				  title: "Sauvegarde de l'équipe",
				  message: "Confirmez-vous la sauvegarde de l'équipe sur le serveur ?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
				  //console.log(result);
				  if (result) {
					//console.log("On sauvegarde sur le serveur");
					//console.log("Equipe :"+JSON.stringify(this.$store.state.selectedEquipe));
					//console.log("Participants :"+JSON.stringify(this.$store.state.participants));
					axios
						  .post('https://www.telethon.citeyen.com/public/api/equipes/uploadEquipe', {
							Equipe : this.$store.state.selectedEquipe
						  })
						  .then(response => {
								//console.log("update OK");
								// maintenant on récupère les informations sur le serveur pour être synchro
							
							
								// mise a jour de la version locale à partir de la version serveur
								let params = {};
								params["commune"] = this.$store.state.selectedEquipe.commune;
								params["nom"] = this.$store.state.selectedEquipe.nom;
								//console.log("Appel suivant synchro");
								axios
								.get('https://telethon.citeyen.com/public/api/equipes/info', {params : params})
								.then(response => {
									this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data.equipe,"scores" : response.data.scores});
									alert({
									  title: "Chargement de l'équipe",
									  message: "Synchronisation de l'équipe avec le serveur OK",
									  okButtonText: "OK"
									});
									this.rafraichir();
								})
								.catch(error => {
									//console.log("updatete KO : "+error);
									alert({
									  title: "Problème de sauvegarde",
									  message: "La synchronisation avec le serveur est KO. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
									  okButtonText: "OK"
									}).then(() => {
									  //console.log("Alert dialog closed");
									});
								});
						  })
						  .catch(error => {
							//console.log("updatete KO : "+error);
							alert({
							  title: "Problème de sauvegarde",
							  message: "La sauvegarde n'est pas possible actuellement. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
							  okButtonText: "OK"
							}).then(() => {
							  //console.log("Alert dialog closed");
							  this.$navigateTo(mesDefis);
							});
						  })
					
				  }
				});
			},
			
			
		},
    };
</script>

<style>
.titleResultat {
	color : black;
	font-weight: bold;
	font-size: 30;
}
.moyenneResultat {
	color : black;
	font-weight: bold;
	font-size: 45;
	text-align: center;
}
.ml20 {
	margin-left : 20px;
}

</style>