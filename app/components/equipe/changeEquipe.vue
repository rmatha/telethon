<template>
	<page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<ScrollView row="1" col="0" >
				<StackLayout>  
					<GridLayout rows="*" columns="*,*" marginBottom="5">
						<Button :class="getClassButtonNouvelleEquipe" row="0" col="0" text="Nouvelle équipe" @tap="nouvelleEquipe" />
						<Button :class="getClassButtonExistanteEquipe" row="0" col="1" text="Equipe existante" @tap="equipeExistante" /> 
						<StackLayout row="0" colSpan="2" class="menuEquipe"> </StackLayout>
					</GridLayout>
					<StackLayout v-if="isNouvelleEquipe" >
						<Label text="Création de la nouvelle équipe" class="entetePage"/>
						<FloatLabel placeholder="Nom de l'équipe" label="nom de l'équipe" :valeur="input.nom" @updateValeur="updateNomEquipe"/>
						<GridLayout rows="30, auto" marginBottom="5">
							<Label ref="labelVille" row="1" text="Ville du challenge Téléthon" opacity="0.4" fontSize="14" class="input" />
							<TextField ref="textFieldVille" row="1" borderBottomColor="#fff" padding="0" @focus="onFocus"
						@blur="onBlur" borderBottomWidth="3" @textChange="onTextChange" v-model="input.commune"/>
						</GridLayout>
						<ScrollView v-if="affichageVilles" >
							<StackLayout backgroundColor="#3c495e" >
								<GridLayout v-for="ville in villes" rows="40" columns="*"  >
									<Label :text="ville.nom" @tap="selectVille(ville.nom,ville.code)" class="labelVille"/>
								</GridLayout>
							</StackLayout>
						</ScrollView>
						<FloatLabel placeholder="Mot de passe" label="code de confidentialité" :valeur="input.code" @updateValeur="updateCodeEquipe" />
						<GridLayout rows="auto,auto" columns="*,50" marginBottom="5">
							<Image row="0" col="1" v-if="input.organisateur" class="imageCheck" src="~/assets/icons/checkTrue.png" @tap="updateOrganisateur"/>
							<Image row="0" col="1" v-else  class="imageCheck"src="~/assets/icons/checkFalse.png" @tap="updateOrganisateur"/>
							<Label row="0" col="0" text="Equipe organisatrice" fontSize="14" class="labelCheck" />
							<Image row="1" col="1" v-if="input.admin" class="imageCheck" src="~/assets/icons/checkTrue.png" @tap="updateCoordinateur"/>
							<Image row="1" col="1" v-else class="imageCheck" src="~/assets/icons/checkFalse.png" @tap="updateCoordinateur"/>
							<Label row="1" col="0" text="Equipe de coordination Téléthon" fontSize="14" class="labelCheck" />
						</GridLayout>
						<Button text="Créer l'équipe" @tap="creerEquipe" class="boutonAction"/>
					</StackLayout>
					<StackLayout v-if="isExistanteEquipe" >
						<Label text="Sélection de l'équipe" class="entetePage"/>
						<GridLayout rows="30, auto" marginBottom="5">
							<Label ref="labelVille" row="1" text="Ville du challenge Téléthon" opacity="0.4" fontSize="14" class="input" />
							<TextField ref="textFieldVille" row="1" borderBottomColor="#fff" padding="0" @focus="onFocus"
						@blur="onBlur" borderBottomWidth="3" @textChange="onTextChange" v-model="input.commune"/>
						</GridLayout>
						<ScrollView v-if="affichageVilles" >
							<StackLayout backgroundColor="#3c495e" >
								<GridLayout v-for="ville in villes" rows="40" columns="*"  >
									<Label :text="ville.nom" @tap="selectVille(ville.nom,ville.code)" class="labelVille"/>
								</GridLayout>
							</StackLayout>
						</ScrollView>
						<ListPicker v-if="affichageEquipes" ref="equipeEnCours" :items="equipesVille" textField="nom" @tap="selectEquipeExistante()"  />
						<Label v-else textWrap="true" text="Il n'existe pas encore d'équipe sur cette commune. Utiliser 'Créer une équipe'" />
						
					</StackLayout>
				</StackLayout>
			</ScrollView>
			</StackLayout>
		</DockLayout>
		
		
	</page>
</template>
 
<script>

	import equipe from "./equipe";
	
    export default {
        mounted() {
			console.log("chargement de la base");
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
			console.log("nombre d'équipe en base : "+this.$store.state.equipes.length);

			console.log("Le flag est passé dans le mounted de changeEquipe");
			//this.$store.state.selectedEquipe.admin = 2;
			//this.$store.state.selectedEquipe.commune = "Angoulême"; 
			//console.log("Admin est à :"+this.$store.state.selectedEquipe.admin);
			console.log("récupération du type : "+this.type);
			if (this.type == "new") {
				this.isNouvelleEquipe = true;
			};
			if (this.type == "search") {
				this.isExistanteEquipe = true;
			};
			
        },
		computed: {	
			getClassButtonNouvelleEquipe () {
				console.log("isNouvelleEquipe : "+this.isNouvelleEquipe);
				return this.isNouvelleEquipe ? "active" : "nonActive";
			},
			getClassButtonExistanteEquipe () {
				console.log("isExistanteEquipe : "+this.isExistanteEquipe);
				return this.isExistanteEquipe ? "active" : "nonActive";
			},
			isOrganisateur(){
				if (this.input.admin == 1){
					console.log("Le flag orga est vert");
					return(true);
					
				}
			},
        },
		props: ['type'],
		data() {
            return {
                isNouvelleEquipe : false,
				isExistanteEquipe : false,
				input: {
					id: -1,
                    nom: "",
                    commune: "",
					code : "",
					admin : false,
					organisateur : false,
				},
				villesRef: [],
                villes: [],
				affichageVilles : false,
				affichageEquipes : false,
				equipesVille : [],
				equipeSelected : "",
            };
        },
	
        methods: { 
			updateOrganisateur() {
				this.input.admin = 0;
				prompt({
				  title: "Code de l'équipe",
				  message: "Veuillez saisir le code des organisateurs qui vous a été donné par l'équipe de coordination téléthon:",
				  okButtonText: "OK",
				  cancelButtonText: "Cancel",
				  defaultText: "",
				}).then(result => {
					console.log(`Dialog result: ${result.result}, text: ${result.text}`);
					if (result.result & (result.text == "16340")) {
						console.log("c'est un orga");
						this.input.organisateur = true;
					}
					else {
						alert("Erreur mauvais code");
						console.log("ce n'est pas un orga");
					}
					
				});
				
				
			},

			updateCoordinateur() {
				this.input.admin = 0;
				prompt({
				  title: "Code de l'équipe",
				  message: "Veuillez saisir le code des organisateurs qui vous a été donné par l'équipe de coordination téléthon:",
				  okButtonText: "OK",
				  cancelButtonText: "Cancel",
				  defaultText: "",
				}).then(result => {
					console.log(`Dialog result: ${result.result}, text: ${result.text}`);
					if (result.result & (result.text == "16340")) {
						console.log("c'est un admin");
						this.input.admin = true;
					}
					else {
						alert("Erreur mauvais code");
						console.log("ce n'est pas une corrdination");
					}
					
				});
				
				
			},

			selectEquipeExistante() { 
				// récupération de la commune sélectionnée
				let indexEquipe = this.$refs.equipeEnCours.nativeView;
				let nom = this.equipesVille[indexEquipe.selectedIndex].nom;
				let code = this.equipesVille[indexEquipe.selectedIndex].code;
				console.log("selectEquipeExistante : sélectionde l'équipe :"+nom+" : sur la commune : "+this.input.commune+ " est le code : "+ code);
				prompt({
				  title: "Code de l'équipe",
				  message: "Veuillez saisir le code de l'équipe:",
				  okButtonText: "OK",
				  cancelButtonText: "Cancel",
				  defaultText: "",
				}).then(result => {
					console.log(`Dialog result: ${result.result}, text: ${result.text}`);
					if (result.result & (result.text == code)) {
						alert({
						  title: "Sélection d'équipe",
						  message: "L'équipe "+nom+" de la commune "+this.input.commune+" est sélectionnée",
						  okButtonText: "OK"
						}).then(() => {
						  this.input.nom = nom;
						  this.input.code = code;
						  this.$store.dispatch("updateCurrentEquipe", this.input);
						  this.$navigateTo(equipe);
						});
					}
					else {
						alert({
						  title: "Sélection d'équipe",
						  message: "Le code n'est pas correct",
						  okButtonText: "OK"
						}).then(() => {
						  console.log("pas le bon code ! ");
						});
					}
				});
				
			},
			creerEquipe() {
				let isEquipeExisteDeja = this.$store.state.equipes.filter(equipe => {
					if (( this.input.commune == equipe.commune) & ( this.input.nom == equipe.nom)) {
						return true;
					}
					return false;
				});
				if (isEquipeExisteDeja.length > 0) {
					alert({
					  title: "Création d'équipe impossible",
					  message: "Le nom de cette équipe est déjà utilisé sur cette commune. Utilisez un autre nom ou appuyez sur 'Equipe existante' pour sélectionner cette équipe",
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
					});
				}
				else {
					console.log("on peut créer la nouvelle équipe : "+JSON.stringify(this.input));
					this.$store.dispatch("insertCurrentEquipe", this.input);
					alert({
					  title: "Création d'équipe confirmée",
					  message: "Vous allez être redirigé pour intégrer les membres à votre équipe",
					  okButtonText: "OK"
					}).then(() => {
					  this.$navigateTo(equipe);
					});
				};
			},
			nouvelleEquipe() {
				this.isNouvelleEquipe = true;
				this.isExistanteEquipe = false;
			},
			equipeExistante() {
				this.isNouvelleEquipe = false;
				this.isExistanteEquipe = true;
			},
			updateNomEquipe(nomEquipe) {
				this.input.nom = nomEquipe;
			},
			updateCodeEquipe(codeEquipe) {
				this.input.code = codeEquipe;
			},
			selectVille(nom,code) {
				console.log("Sélection de la ville"+nom);
				console.log("Liste des equipes :"+JSON.stringify(this.$store.state.equipes));
				let textField = this.$refs.textFieldVille.nativeView;
                textField.text = nom;
				this.affichageVilles = false; 
				this.equipesVille = this.$store.state.equipes.filter(equipe => {
					return nom == equipe.commune;
				});
				if (this.equipesVille.length > 0) {
					this.affichageEquipes = true;
				}
				else {
					this.affichageEquipes = false; 
				};
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
				this.affichageEquipes = false;
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
.imageCheck {
	width : 100px;
	margin : 20px;
}

.labelCheck {
	margin : 20px;
}

.menuEquipe {
	background-color : #fff;
	height : 20px;
	vertical-align : bottom;
}

.active {
	background-color : white;
	color : #fbc62d;
}

.nonActive {
	background-color : #fbc62d;
	color : white;
}
</style>