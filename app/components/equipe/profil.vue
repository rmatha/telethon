<template>
	<page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*">
			<Header row="0" col="0" />
			<ScrollView row="1" col="0" >
				<StackLayout class="m-20"> 
					<GridLayout rows="auto" columns="*,50,50" >
							<Label row="0" col="0" class="m-b-20 label" text="Participant :" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/delete.png" @tap="deleteProfil"/>
							<Image row="0" col="2" class="actionButton" src="~/assets/icons/save.png" @tap="save"/>
						</GridLayout>
					<FloatLabel placeholder="Pseudo" label="Pseudo" :valeur="myFirstname" @updateValeur="updateNom"/>
					<!--<FloatLabel placeholder="Prénom" label="prenom" :valeur="myLastname" @updateValeur="updatePrenom"/>-->
					<GridLayout rows="30, auto" marginBottom="5">
						<Label ref="labelVille" row="1" text="Ville d'habitation" opacity="0.4" fontSize="14" class="input" />
						<TextField ref="textFieldVille" row="1" borderBottomColor="#fff" padding="0" @focus="onFocus"
					@blur="onBlur" borderBottomWidth="3" @textChange="onTextChange" />
					</GridLayout>
					<ScrollView v-if="affichageVilles" >
						<StackLayout backgroundColor="#3c495e" >
							<GridLayout v-for="ville in villes" rows="40" columns="*"  >
								<Label :text="ville.nom" @tap="selectVille(ville.nom,ville.code)" class="labelVille"/>
							</GridLayout>
						</StackLayout>
					</ScrollView>
					<label ref="villeCode" />
					<FloatLabel placeholder="Téléphone" label="telephone" :valeur="myTelephone" @updateValeur="updateTelephone"/>
					
					
				</StackLayout>
				
			</ScrollView>
			
			<Footer row="2" col="0" />
		</GridLayout>
		
		
	</page>
</template>
 
<script>

	import equipe from "./equipe";
	import modal from "../include/modal";


    export default {
        mounted() {
			console.log("chargment de la base");
            console.log("mounted Chargement des villes de Charente"); 
            fetch(
                    "https://geo.api.gouv.fr/departements/16/communes?fields=nom,code&format=json&geometry=centre"
                )
                .then(response => response.json())
                .then(data => {
                    this.villesRef = data;
                    console.log("nom de la premiere ville : " + data[0].nom);
                    console.log("Nombre de villes : " + this.villes.length);
                }
			);
			this.load();
			
			
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
					id : -1,
                    firstname: "",
                    lastname: "",
					telephone: "",
					equipe: "",
				},
				villesRef: [],
                villes: [],
                affichageVilles: false
            };
        },
		
        methods: {
			updateTelephone(telephone) {
				this.input.telephone = telephone;
			},
			updateNom(nom) {
				this.input.firstname = nom;
			},
			updatePrenom(prenom) {
				this.input.lastname = prenom;
			},
			save() {
				console.log("sauvegarde des informations : "+this.input.id+" : "+this.input.firstname);
			    console.log("sauvegarde des informations : "+this.input.lastname+" : "+this.input.equipe);
			    this.$store.dispatch("insertParticipant", this.input);
				this.updateEquipe = true;
				this.$navigateTo(equipe);
            },
            load() {
				if (this.participant != null) {
					this.input = this.participant;
					console.log("R2cupération des informations du participant");
				}
				
				console.log("Equipe en cours : "+this.$store.state.selectedEquipe.nom);
				
            },
			deleteProfil() {
				// affichage du modal de confirmation
				this.$showModal(modal, { fullscreen: true, props: { textModal: "Voulez-vous supprimer le participant "+this.input.firstname+" ?" }}).then( data => {
					console.log(data);
					if (data) {
						console.log("on supprime !");
						this.$store.dispatch("deleteParticipant", this.input);
						this.updateEquipe = true;
						this.$navigateTo(equipe);
					}
					else {
						console.log("pas touche !");
					}
				});
			},
			selectVille(nom,code) {
				console.log("Sélection de la ville");
				console.log(nom);
				let textField = this.$refs.textFieldVille.nativeView;
                let villeCode = this.$refs.villeCode.nativeView;
                textField.text = nom;
				villeCode.text = code;
				this.affichageVilles = false;

				
			},
            onTextChange: function() {
                let textField = this.$refs.textFieldVille.nativeView;
                console.log("onTextChange saisie " + textField.text);
                console.log("onTextChange label " + textField.name);
				// filtre de la liste villes 
				this.villes = this.villesRef.filter(ville => {
					return ville.nom.toLowerCase().indexOf(textField.text.toLowerCase()) > -1
				})
				if (textField.text.length > 2) {
					this.affichageVilles = true;
				}
				else {
					this.affichageVilles = false;
				};
                //ApplicationSettings.setString(textField.name, textField.text);
                //this.firstTx = textField.text;
            },
            onFocus: function() {
                // get our elments to maninpulate.
                const label = this.$refs.labelVille.nativeView;
                const textField = this.$refs.textFieldVille.nativeView;

                // animate the label sliding up and less transparent.
                label
                    .animate({
                        translate: {
                            x: 0,
                            y: -25
                        },
                        opacity: 1
                    })
                    .then(() => {}, () => {});

                // set the border bottom color to green to indicate focus
                //textField.borderBottomColor = new Color("#00b47e");
            },
            onBlur: function() {
                const label = this.$refs.labelVille.nativeView;
                const textField = this.$refs.textFieldVille.nativeView;

                // if there is text in our input then don't move the label back to it's initial position.
                if (!textField.text) {
                    label
                        .animate({
                            translate: {
                                x: 0,
                                y: 0
                            },
                            opacity: 0.4
                        })
                        .then(() => {}, () => {});
                }
                // reset border bottom color.
                //textField.borderBottomColor = new Color("#c ec8c8");
            }
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