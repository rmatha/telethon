<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			
			<StackLayout  dock="center" class="root" >
				<label class="titre mb50" text="Bonjour !!"  horizontalAlignment="center"/>
				
				
				<StackLayout  v-if="isEquipeSelected">
					<GridLayout rows="*,*,*" columns="*,auto">
						<StackLayout row="0" col="0">
							<label class="label" text="Equipe :"  />
							<label class="valeur" :text="nomEquipe"  />
							<label class="valeur" :text="nbParticipantsEquipe"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="0" @tap="navEquipe" stretch="none" />
						<StackLayout row="1" col="0">	
							<label class="label" text="Défis : "  />
							<label class="valeur" :text="nbDefisEquipe"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="1" @tap="navMesDefis" stretch="none" />
						<StackLayout row="2" col="0">	
							<label class="label" text="Score : "/>
							<label class="valeur" :text="moyenneEquipe"  /><Label :text="networkStatus" />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="2" @tap="navScore" stretch="none" class="modify"/>
						
					</GridLayout>
				</StackLayout>
				<StackLayout v-else>
					<Label class="labelEquipeSelect" text="Pour commencer vous devez définir votre équipe" textWrap="true" horizontalAlignment="center" />
					<GridLayout rows="100,100" columns="auto,auto" horizontalAlignment="center" >
						<Image  src="~/assets/icons/equipeAdd.png" col="0" row="0" @tap="navChangeEquipe('new')" />
						<Image  src="~/assets/icons/equipeSearch.png" col="1" row="0" @tap="navChangeEquipe('search')" />
						<Label class="actionLabel" text="Créer une équipe"  row="1" col="0" @tap="navChangeEquipe('new')"/>
						<Label class="actionLabel" text="Sélectionner une équipe"  row="1" col="1" @tap="navChangeEquipe('search')"  />
					</GridLayout>
				</StackLayout>
				
				
			</StackLayout>
			
		</DockLayout>
    </Page>
</template>

<script>
	import changeEquipe from "./equipe/changeEquipe";
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
				categories : []
            };
        },
		computed: {
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
				if (this.$store.state.selectedEquipe.defis_equipes) {
					var nbDefisActifs = this.$store.state.selectedEquipe.defis_equipes.filter(defi => {
						//console.log("ACCUEIL : nbDefisEquipe : "+JSON.stringify(defi));
						return !defi.delete;
					});
					if (nbDefisActifs.length > 0) {
						messageDefi ="Nombre de défis pour l'équipe : "+nbDefisActifs.length;
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
			//console.log("ACCUEIL : STATE : selectedEquipe "+JSON.stringify(this.$store.state.selectedEquipe));
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
			navChangeEquipe(type) {
				this.$navigateTo(changeEquipe, { props: {type : type}});
			},
			navMesDefis() {
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
			navScore() {
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
			navEquipe() {
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
				.get('https://telethon.citeyen.com/public/api/equipes/info', {params : params})
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
							this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data});
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
