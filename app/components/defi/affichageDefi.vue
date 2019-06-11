<template>
    <page>
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
				<GridLayout v-if="isCommune" rows="auto" columns="*,25,50,50">
					<Label row="0" col="0" text="defi pour la commune" class="defiName"/>
					<Image row="0" col="1" src="~/assets/icons/Cross-red.png" @tap="supprimerDefiCommune(defi)"/>
					<Image row="0" col="2" v-if="defiPresentCommune(defi.id)" src="~/assets/icons/Cross-red.png" @tap="enleverDefiCommune"/>
					<Image row="0" col="2" v-else src="~/assets/icons/add-256.gif" @tap="ajouterDefiCommune"/>
				</GridLayout>
				<GridLayout v-else rows="auto" columns="*,25,50,50">
					<Label row="0" col="0" :text="defi.nom" class="defiName"/>
					<Image row="0" col="1" src="~/assets/icons/Cross-red.png" @tap="supprimerDefi(defi)"/>
					<Image row="0" col="2" v-if="defiPresent(defi.id)" src="~/assets/icons/Cross-red.png" @tap="enleverDefi"/>
					<Image row="0" col="2" v-else src="~/assets/icons/add-256.gif" @tap="ajouterDefi"/>				
				</GridLayout>
				<Label text="Description" class="defiLabel" />
				<Label :text="defi.description_courte" class="defiDesc"/>
				<StackLayout v-if="isNotCommune" orientation="horizontal" backgroundcolor="#562389">
					<Label width="85%" class="m-b-20" :text="titreScore" textWrap="true" />
					<Image width="15%" src="~/assets/icons/add-256.gif" @tap="addScore"/>
				</StackLayout>
				<ListView v-if="isNotCommune" for="item in $store.state.scoresEquipe" height="100%" >
				  <v-template>
					<GridLayout v-if="isCurrentDefi(item)" rows="*" columns="*,50" width="100%" margin="0" @tap="editScore(item)">
						<GridLayout col="0" verticalAlignment="bottom">
							<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
								<Label :text="getProfilNom(item)" class="defiTitle" />
								
							</StackLayout>
						</GridLayout>
						<Label col="1" :text="item.score" class="defiTitle" />
					</GridLayout>
							
							
							
				  </v-template>
				</ListView>
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
	</page>
	
	
</template>

<script>
	
	import modal from "../include/modal";
	import listDefisCat from "./listDefisCat";
	import addScore from "../score/addScore";
	
	export default {
		props: ['defi','categorie','commune'],
		computed: {
			titreScore() {
				return "Liste des scores : "+this.$store.state.scoresEquipe.length;
			},
			isCommune() {
				if(this.commune) {
					return true;
				}
				return false;
			},
			isNotCommune() {
				if(this.commune) {
					return false;
				}
				return true;
			},
		},
        data() {
            return {}
        },
		mounted() {
			console.log("affichageDefi : commune : "+this.commune);
        },
		methods: {
			getProfilNom(item) {
				console.log("getProfilNom : "+ JSON.stringify(this.$store.state.profilsEquipe));
				console.log("getProfilNom : "+ item.idProfil);
				let profilEnCours = this.$store.state.profilsEquipe.find(e => e.id == item.idProfil);
				return profilEnCours.firstname + " " +profilEnCours.lastname;
			},
			isCurrentDefi(item) {
				console.log("isCurrentDefi : "+JSON.stringify(item));
				console.log("isCurrentDefi : "+item.idDefi +" --- "+this.defi.id);
				return item.idDefi == this.defi.id;
			},
			editScore(item) {
				console.log("Edit d'un score :"+item.id);
				this.$navigateTo(addScore, { props: {score: item, categorie: this.categorie, defi: this.defi}});
			},
			addScore() {
				console.log("Ajout d'un score");
				this.$navigateTo(addScore, { props: {score : null, categorie: this.categorie, defi: this.defi}});
			},
			defiPresent(idDefiEncours) {
				//console.log("NB nosDefis : "+this.$store.state.nosDefis.length);
				var filterDefi = this.$store.state.nosDefis.filter(function(elem) {
					console.log("elem.idDefi : "+elem.id+ "--idDefiEncours--"+idDefiEncours);
					if (elem.id == idDefiEncours) return elem;
				});
				if (filterDefi.length > 0) {
					return true;
				}
				return false;
			},
			defiPresentCommune(idDefiEncours) {
				console.log("NB defiPresentCommune : "+this.$store.state.defisCommune.length);
				var filterDefi = this.$store.state.defisCommune.filter(function(elem) {
					console.log("elem.idDefi : "+elem.id+ "--idDefiEncours--"+idDefiEncours);
					if (elem.id == idDefiEncours) return elem;
				});
				if (filterDefi.length > 0) {
					return true;
				}
				return false;
			},
			supprimerDefi(defi) {
				// affichage du modal de confirmation
				this.$showModal(modal, { fullscreen: true, props: { textModal: "Voulez-vous supprimer le défi "+defi.nom+" ?" }}).then( data => {
					console.log(data);
					if (data) {
						console.log("on supprime !");
						this.$store.dispatch("deleteDefi", defi);
						this.$navigateTo(listDefisCat, { props: {categorie: this.categorie}});
					}
					else {
						console.log("pas touche !");
					}
				});
			},
			supprimerDefiCommune(defi) {
				// affichage du modal de confirmation
				this.$showModal(modal, { fullscreen: true, props: { textModal: "Voulez-vous supprimer le défi "+defi.nom+" pour la commune "+this.commune+" ?" }}).then( data => {
					console.log(data);
					if (data) {
						console.log("on supprime !");
						//this.$store.dispatch("deleteDefiCommune", defi);
						//this.$navigateTo(listDefisCat, { props: {categorie: this.categorie, commune : this.commune}});
					}
					else {
						console.log("pas touche !");
					}
				});
			},
			enleverDefi() {
				console.log("on enleve de la liste de nosDefis");
				this.$store.dispatch("deleteNosDefis", {defi : this.defi});
			},
			ajouterDefi() {
				console.log("on ajoute de la liste de nosDefis");
				this.$store.dispatch("insertNosDefis", {defi : this.defi,equipe : this.$store.state.currentEquipe});
				
			},
			enleverDefiCommune() {
				console.log("on enleve de la liste de defisCommune");
				this.$store.dispatch("deleteDefisCurrentCommune", {defi : this.defi});
			},
			ajouterDefiCommune() {
				console.log("on ajoute de la liste de defisCommune");
				this.$store.dispatch("insertDefisCurrentCommune", {defi : this.defi,equipe : this.$store.state.currentEquipe});
				
			}
			
		},
    };
</script>

<style>
.defiName {
	color : black;
	font-weight: bold;
	font-size: 20px;
	text-align : center;
}
.defiDesc {
	color : black;
	font-size: 10px;
	font-weight: normal;
	
}

.defiLabel {
	font-weight: bold;
	font-size: 15px;
	text-decoration: underline;
}
</style>