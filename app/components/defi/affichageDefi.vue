<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<Label row="0" col="0" :text="$store.state.selectedDefi.nom" class="sousTitre"/>
				<Label class="label" text="Description :"  />
				<Label :text="$store.state.selectedDefi.description_courte" class="defiDesc"/>
				<GridLayout rows="auto" columns="*,50" >
					<Label row="0" col="0" class="label m-b-20" text="Liste des scores :" textWrap="true" />
					<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="addScore"/>
				</GridLayout>
				<ListView  for="item in $store.state.scoresEquipe" height="100%" >
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
				<Button class="boutonAction" v-if="defiPresent($store.state.selectedDefi.id)" :text="enleverDefiLabel" @tap="enleverDefi"/>
				<Button class="boutonAction" v-else :text="ajouterDefiLabel" @tap="ajouterDefi"/>	
				<Button class="boutonAction" text="Supprimer le défi de la base" @tap="supprimerDefi"/>
					
			</StackLayout>
		</DockLayout>
		
	</page>
	
	
</template>

<script>
	
	import modal from "../include/modal";
	import listDefisCat from "./listDefisCat";
	import addScore from "../score/addScore";
	import store from "../store/teleStore";
	
	export default {
		computed: {
			ajouterDefiLabel() {
				if(this.$store.state.selectedCommune) {
					return "Ajouter à ma commune";
				}
				return "Ajouter à mes défis"
			},
			enleverDefiLabel() {
				if(this.$store.state.selectedCommune) {
					return "Enlever de ma commune";
				}
				return "Enlever de mes défis"
			},
		},
        data() {
            return {}
        },
		mounted() {
			console.log("Defi : "+JSON.stringify(this.$store.state.selectedDefi));
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
				console.log("isCurrentDefi : "+item.idDefi +" --- "+this.$store.state.selectedDefi.id);
				return item.idDefi == this.$store.state.selectedDefi.id;
			},
			editScore(item) {
				console.log("Edit d'un score :"+item.id);
				this.$store.state.selectedScore = item;
				this.$navigateTo(addScore);
			},
			addScore() {
				console.log("Ajout d'un score");
				this.$store.state.selectedScore = null;
				this.$navigateTo(addScore);
			},
			defiPresent(idDefiEncours) {
				console.log("on vérifie si le défi est présent");
				console.log("this.$store.state.selectedCommune"+this.$store.state.selectedCommune);
				var filterDefi = []
				if (this.$store.state.selectedCommune) {
					filterDefi = this.$store.state.defisCommune.filter(function(elem) {
						console.log("elem.idDefi : "+elem.id+ "--idDefiEncours--"+idDefiEncours);
						if (elem.id == idDefiEncours) return elem;
					});
				}
				else {
					console.log("on passe par nosDefis");
					filterDefi = this.$store.state.nosDefis.filter(function(elem) {
						console.log("elem.idDefi : "+elem.id+ "--idDefiEncours--"+idDefiEncours);
						if (elem.id == idDefiEncours) return elem;
					});
				}
				if (filterDefi.length > 0) {
					console.log("le défi a été trouvé");
					return true;
				}
				console.log("le défi n'a pas été trouvé");
				return false;
			},
			supprimerDefi(defi) {
				// affichage du modal de confirmation
				this.$showModal(modal, { fullscreen: true, props: { textModal: "Voulez-vous supprimer le défi "+defi.nom+" ?" }}).then( data => {
					console.log(data);
					if (data) {
						console.log("on supprime !");
						if (this.$store.state.selectedCommune) {
							this.$store.dispatch("deleteDefiCommune", defi);
						}
						else {
							this.$store.dispatch("deleteDefi", defi);
						}
						this.$store.state.selectedDefi = null;
						this.$navigateTo(listDefisCat);
					}
					else {
						console.log("pas touche !");
					}
				});
			},
			enleverDefi() {
				if (this.$store.state.selectedCommune) {
					console.log("on enleve de la liste de defisCommune");
					this.$store.dispatch("deleteDefisCurrentCommune", {defi : this.$store.state.selectedDefi});
				}
				else {
					console.log("on enleve de la liste de nosDefis");
					this.$store.dispatch("deleteNosDefis", {defi : this.$store.state.selectedDefi});
				}
			},
			ajouterDefi() {
				if (this.$store.state.selectedCommune) {
					console.log("on ajoute de la liste de defisCommune");
					this.$store.dispatch("insertDefisCurrentCommune", {defi : this.$store.state.selectedDefi,equipe : this.$store.state.currentEquipe});
				}
				else {
					console.log("on ajoute de la liste de nosDefis");
					this.$store.dispatch("insertNosDefis", {defi : this.$store.state.selectedDefi,equipe : this.$store.state.currentEquipe});
				}
			},
		},
    };
</script>

<style>

.defiDesc {
	color : black;
	font-size: 10px;
	font-weight: normal;
	
}

</style>