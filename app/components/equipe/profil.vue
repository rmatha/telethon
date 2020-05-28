<template>
	<page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*">
			<Header row="0" col="0" />
			<ScrollView row="1" col="0" >
				<StackLayout class="m-20"> 
					<GridLayout rows="auto" columns="*,50,50" >
							<Label row="0" col="0" class="m-b-20 sousTitre" text="Edition participant" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/delete.png" @tap="deleteProfil"/>
							<Image row="0" col="2" class="actionButton" src="~/assets/icons/add-256.gif" @tap="save"/>
						</GridLayout>
					<StackLayout>
						<Label class="label" ref="label" text="Pseudo" />
						<TextField class="textfield" hint="Pseudo" v-model="input.nom"/>
						<Label ref="labelVille" text="Ville d'habitation" class="label" />
						<TextField class="textfield" v-model="input.commune" @textChange="onTextChange" />
					</StackLayout>
					<ScrollView v-if="affichageVilles" >
						<StackLayout backgroundColor="#ffffff" >
							<GridLayout v-for="ville in villes" rows="40" columns="*"  >
								<Label :text="ville.nom" @tap="selectVille(ville.nom,ville.code)" />
							</GridLayout>
						</StackLayout>
					</ScrollView>
					
					
				</StackLayout>
				
			</ScrollView>
			
			<Footer row="2" col="0" />
		</GridLayout>
		
		
	</page>
</template>
 
<script>

	import equipe from "./equipe";
	import modal from "../include/modal";
	import villesRef from "@/assets/villes.json"


    export default {
        mounted() {
			
			//console.log("Participant en cours : "+JSON.stringify(this.$store.state.selectedParticipant));
			if (this.$store.state.selectedParticipant != null) {
				this.input.nom = this.$store.state.selectedParticipant.nom;
				this.input.commune = this.$store.state.selectedParticipant.commune;
				
				
				//console.log("R2cupération des informations du participant");
			}
			else {
				//console.log("nouveau participant");
			}
			//console.log("Equipe en cours : "+this.$store.state.selectedEquipe.nom);
			
			
        },
		computed: {
			titreProfil() {
				return "Ajout d'un participant pour l'équipe "+this.$store.state.selectedEquipe.nom
			},
            myFirstname() {
				return this.input.firstname;
			},
			myLastname() {
				return this.input.lastname;
			},	
			myTelephone() {
				return this.input.telephone;
			},				
        },
		props: ['currentEquipe','participant'],
		data() {
            return {
                input: {
					nom: "",
					commune : "",
				},
                villes: [],
                affichageVilles: false,
				updateCommune : false,
            };
        },
		
        methods: {
			save() {
				var doublon = false;
				if (this.input.nom.length > 0) {
					// on verifie si on a un selectedParticipant
					if (this.$store.state.selectedParticipant) {
						// si le nom a changé, on vérifie si le nom n'existe pas déjà dans l'équipe
						if (this.$store.state.selectedParticipant.nom != this.input.nom) {
							var doublon = this.$store.state.selectedEquipe.participants.filter(item => {
								return item.nom == this.input.nom;
							});
							//console.log("PROFIL :SAVE: doublon size : "+doublon.length);
							if (doublon.length > 0) {
								// le nom existe dajà donc on refuse 
								alert({
								  title: "Saisie incorrecte",
								  message: "Cette personne existe déjà dans l'équipe",
								  okButtonText: "OK"
								});
							}
							else {
								// on applique les modifs sur la paersonne selectionnée
								this.$store.dispatch("updateParticipant", {"participant" : this.input});
								this.$store.state.updateEquipe = true;
								this.$navigateTo(equipe);
							}
						}
						else {
							// on update le participant
							this.$store.dispatch("updateParticipant", {"participant" : this.input});
							this.$store.state.updateEquipe = true;
							this.$navigateTo(equipe);
						}
					}
					else {
						// on ajoute un nouveau participant si n'existe pas déjà dans la liste des participants
						//console.log("PROFIL : SAVE : on créé un participant");
						if (this.$store.state.selectedEquipe.participants) {
							this.$store.state.selectedEquipe.participants.forEach (participant => {
								if (participant.nom == this.input.nom) {
									doublon = true;
								}						
							});
						};
						if (!doublon) {
							//console.log("PROFIL : SAVE : on ajoute le participant:  : "+JSON.stringify(this.input));
							this.$store.dispatch("addParticipant", {"participant" : this.input});
							this.$store.state.updateEquipe = true;
							this.$navigateTo(equipe);
						}
						else {
							alert({
							  title: "Saisie incorrecte",
							  message: "Cette personne existe déjà dans l'équipe",
							  okButtonText: "OK"
							})
						}
					}
				}
				else {
					alert({
						  title: "Saisie incorrecte",
						  message: "Le nom de la personne est obligatoire",
						  okButtonText: "OK"
					})
				}
            },
			deleteProfil() {
				// affichage du modal de confirmation
				confirm({
				  title: "Confirmation de suppression",
				  message: "Voulez-vous supprimer le participant : "+this.$store.state.selectedParticipant.nom,
				  okButtonText: "oui",
				  cancelButtonText: "non"
				}).then(() => {
					console.log("on supprime !");
					this.$store.dispatch("deleteParticipant", {"participant" : this.input});
					this.$navigateTo(equipe);
					this.$store.state.updateEquipe = true;
				});
					
			},
			selectVille(nom,code) {
				//console.log("Sélection de la ville");
				//console.log(nom);
				this.input.commune = nom;
				this.affichageVilles = false;
				this.updateCommune = true;

				
			},
            onTextChange: function() {
                //console.log("commune texte : " + this.input.commune);
				// filtre de la liste villes 
				if (this.input.commune) {
					this.villes = villesRef.filter(ville => {
						return ville.nom.toLowerCase().indexOf(this.input.commune.toLowerCase()) > -1
					})
				};
				if ((this.input.commune.length > 2) && (!this.updateCommune)) {
					this.affichageVilles = true;
				}
				else {
					this.affichageVilles = false;
				};
				this.updateCommune = false;
			},
        }
    };
</script>

<style>

.titreTelethon {
	font-size : 38px;
}
.red {
	color: #ff0000;
}

.green {
	color : #00ff00;
}
</style>