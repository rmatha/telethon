<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			
			<StackLayout  v-if="loading" dock="center" class="root" >
				<GridLayout rows="*" columns="*,auto,*">
					
				</GridLayout>
			</StackLayout>
			<StackLayout  v-else dock="center" class="root" >
				<label class="titre mb50" text="Bonjour !"  horizontalAlignment="center"/>
				
				<StackLayout  v-if="isEquipeSelected">
					<GridLayout rows="*,*,*" columns="*,40">
						<StackLayout row="0" col="0">
							<label class="label" text="Equipe :"  />
							<label class="valeur" :text="nomEquipe"  />
							<label class="valeur" :text="nbParticipantsEquipe"  />
							<label class="valeur" :text="communeEquipe"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="0" @tap="navEquipe" verticalAlignment="top"/>
						<StackLayout row="1" col="0">	
							<label class="label" text="Défis : "  />
							<label class="valeur" :text="nbDefisEquipe"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="1" @tap="navMesDefis" verticalAlignment="top"/>
						<StackLayout row="2" col="0">	
							<label class="label" text="Score : "/>
							<label class="valeur" :text="moyenneEquipe"  /><Label :text="networkStatus" />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="2" @tap="navScore" verticalAlignment="top"/>
						
					</GridLayout>
				</StackLayout>
				<StackLayout v-else>
					<GridLayout rows="100,*,200" columns="200,*" horizontalAlignment="center" >
						<Label row="1" col="0" colSpan="3" class="labelEquipeSelect" text="Pour commencer vous devez définir votre équipe" textWrap="true" horizontalAlignment="center" />
						<Image row="2" col="0"  src="~/assets/fleche_rouge.png"  />
					</GridLayout>
				</StackLayout>
				
				
			</StackLayout>
			
		</DockLayout>
    </Page>
</template>

<script>
	import equipe from "./equipe/equipe";
	import mesDefis from "./defi/mesDefis";
	import resultats from "./score/resultats";
	import axios from 'axios';
	const connectivity = require("connectivity");
	
    export default {
		data() {
            return {
				networkStatus : "",
				connexion : false,
				categories : [],
				loading : false
            };
        },
		computed: {
			communeEquipe() {
				return "Commune : "+this.$store.state.selectedEquipe.commune;
			},
			moyenneEquipe() {
				if (this.$store.state.selectedEquipe.scores) {
					return "Moyenne de l'équipe : "+(this.$store.state.selectedEquipe.scores.length > 0 ?	_.round(_.meanBy(this.$store.state.selectedEquipe.scores, 'score'),2) : "Pas de score enregistré"); 
				}
				return "Pas de score enregistré pour l'équipe";
			},
			nomEquipe() {
				return "Nom de l'équipe: "+this.$store.state.selectedEquipe? "Equipe : "+this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
			},
			nbParticipantsEquipe() {
				if (this.$store.state.selectedEquipe.participants) {
					return "Nombre de particpants : "+this.$store.state.selectedEquipe.participants.length+" participants";
				}
				return "Pas de participant enregistré";
			},
			nbDefisEquipe() {
				var messageDefi = "Pas de défis enregistrés";
				if (this.$store.state.selectedEquipe.admin || this.$store.state.selectedEquipe.organisateur) {
					var messageDefi = "Pas de défis enregistrés pour la commune";
					if (this.$store.state.defiCommune.defis) {
						var nbDefisActifs = this.$store.state.defiCommune.defis.filter(defi => {
							//console.log("ACCUEIL : nbDefisEquipe : "+JSON.stringify(defi));
							return !defi.delete;
						});
						if (nbDefisActifs.length > 0) {
							messageDefi ="Nombre de défis pour la commne : "+nbDefisActifs.length;
						}
					}
				}
				else {
					var messageDefi = "Pas de défis enregistrés pour l'équipe";
					if (this.$store.state.selectedEquipe.defiEquipes) {
						var nbDefisActifs = this.$store.state.selectedEquipe.defiEquipes.filter(defi => {
							//console.log("ACCUEIL : nbDefisEquipe : "+JSON.stringify(defi));
							return !defi.delete;
						});
						if (nbDefisActifs.length > 0) {
							messageDefi ="Nombre de défis pour l'équipe : "+nbDefisActifs.length;
						}
					}
				}
				return messageDefi;
			},
			currentEquipe() {
				var reponse = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe  sélectionnée";
				
				return reponse;
			},
			isEquipeSelected() {
				var temp = this.$store.state.selectedEquipe ? true : false;
				//console.log("isEquipeSelected : "+temp);
				return temp;
			}
        },
        mounted() {
			
			axios
				.get('https://telethon2020.citeyen.com/api/equipe/list')
				.then(response => {
					console.log("liste equipe serveur :"+JSON.stringify(response.data.equipes)); 
					console.log("Version equipe serveur :"+response.data.version); 
					console.log("Version equipe locale :"+this.$store.state.versionEquipe); 
					if (response.data.version > this.$store.state.versionEquipe) {
						// mise a jour de la table de categories
						console.log("MAJ des equipes à partir du serveur");
						this.messages.push("MAJ des équipes à partir du serveur");
						this.$store.dispatch("reloadEquipes",{"equipes" : response.data.equipes,"version" : response.data.version});
					}else {
						this.messages.push("Equipes  à jour ");
					}
					this.go = true;
				});
				
			console.log("ACCUEIL : mounted : defi ");
			console.log(JSON.stringify(this.$store.state.defis));
			console.log("ACCUEIL : mounted : selectedEquipe "+JSON.stringify(this.$store.state.selectedEquipe));
			console.log("ACCUEIL : mounted : defis  commune "+JSON.stringify(this.$store.state.defiCommune));
			// chargement des données en fonction de l'équipe en cours
			//this.$store.dispatch("queryDonnees", isEquipeSelected);
			// vérification si une connexion est disponible
			const connectionType = connectivity.getConnectionType();
			if (connectionType !== connectivity.connectionType.none) {
				// vérification de la version de l'equipe en cours 
				//console.log("Reseau OK");
				
			}
			else {
				//console.log("Pas de réseau !!!");
			}
			//console.log("HOME : chargement de l'équipe en cours !!");
			if (this.$store.state.selectedEquipe) {
				//console.log("HOME : on a bien récupéré l'équipe :"+this.$store.state.selectedEquipe.nom);
				//on peut mettre a jour les tables mesDefis et participants
			}
			else {
				//console.log("Pas d'équipe en cours !!!");
			}
			/*if (this.$store.state.selectedEquipe) {
				//console.log("on charge l'equipe a partir du serveur");
				this.reloadEquipeEnCours();
			};*/
			
		},
        
		methods: {
			tapFlash(currentElement) {
				if (currentElement.className) {
					currentElement.className = currentElement.className + " flash";
				}
				else {
					currentElement.className = "flash";
				}
			},
			navMesDefis(args) {
				this.tapFlash(args.object);
				if (this.$store.state.selectedEquipe) {
					this.$navigateTo(mesDefis);
				}
				else {
					alert({
						  title: "Selection d'une équipe",
						  message: "Veuillez sélectionner une équipe avant d'afficher les défis",
						  okButtonText: "OK"
						})
				}
			},
			navScore(args) {
				this.tapFlash(args.object);
				if (this.$store.state.selectedEquipe) {
					this.$navigateTo(resultats);
				}
				else {
					alert({
						  title: "Selection d'une équipe",
						  message: "Veuillez sélectionner une équipe avant d'afficher les défis",
						  okButtonText: "OK"
						})
				}
			},
			navEquipe(args) {
				this.tapFlash(args.object);
				this.$navigateTo(equipe);
			},
			titreEquipe() {
				if (this.$store.state.selectedEquipe) {
					return this.$store.state.selectedEquipe.nom;
				}
				return "Pas d'équipe en courss";
			},
			reloadEquipeEnCours() {
				let params = {};
				params["commune"] = this.$store.state.selectedEquipe.commune;
				params["nom"] = this.$store.state.selectedEquipe.nom;
				axios
				.get('https://telethon2020.citeyen.com/api/equipe/info', {params : params})
				.then(response => {
					// si la version du serveur plus récente, on récupère 
					//console.log("version de l'équipe  en cours local : "+this.$store.state.selectedEquipe.version);
					//console.log("version de l'équipe en cours  serveur  : "+JSON.stringify(response.data.version));
					//if (response.data.version > this.$store.state.selectedEquipe.version) {
					if (response.data) {
						//console.log("Récupération serveur de l'équipe OK : ");
						if (true) {
						//if (response.data.version > this.$store.state.selectedEquipe.version) {
							//console.log("Mise a jour de la version de l'équipe a partir du serveur");
							this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data.equipe,"scores" : response.data.scores});
						}
						else {
							//console.log("Version de l'équipe déjà à jour");
						}
					};
				});
			},

		}
    };
</script>
<style>



.chargement {
	margin-top : 50%;
	text-align : center;
}

.labelEquipeSelect {
	font-size : 18px;
	margin : 10% 5%;
	text-align : center;
}

.actionLabel {
	margin : 0 10%;
}
</style>
