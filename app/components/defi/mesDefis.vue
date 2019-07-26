<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<ScrollView>
					<StackLayout>
						<GridLayout rows="auto" columns="*,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" text="Mes Défis" textWrap="true" />
							<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="affichageCat"/>
						</GridLayout>
						<ListView for="item in $store.state.nosDefis"  >
						  <v-template>
							<GridLayout rows="*" columns="*,50" width="100%" margin="0" @tap="getDefi(item)">
								<GridLayout col="0" verticalAlignment="bottom">
									<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
										<Label :text="item.nom" class="defiTitle" />
										<Label :text="item.description_courte" class="defiDescription" />
									</StackLayout>
								</GridLayout>
								<Image col="1" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						  </v-template>
						</ListView>
						
						<button class="boutonAction recup" text="Récupérer les défis de ma ville" @tap="recupereDefis" />
						<GridLayout rows="auto" columns="*,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" :text="sousTitreCommune" textWrap="true" />
							<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="affichageCatCommune"/> 
						</GridLayout>
									
						<ListView for="item in $store.state.defisCommune"  >
						  <v-template>
							<GridLayout rows="*" columns="*,50" width="100%" margin="0" @tap="getDefiCommune(item)">
								<GridLayout col="0" verticalAlignment="bottom">
									<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
										<Label :text="item.nom" class="defiTitle" />
										<Label :text="item.description_courte" class="defiDescription" />
									</StackLayout>
								</GridLayout>
								<Image col="1" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						  </v-template>
						</ListView> 
					</StackLayout>
				</ScrollView>
			</StackLayout>
		</DockLayout>
		
		
	</page>
</template>

<script>
	import listeChallengesCat from "../categorie/listCategorie";
	import affichageDefi from "./affichageDefi";
	
	export default {
		computed: {
			sousTitreCommune() {
				return "Défis pour : "+this.$store.state.selectedEquipe.commune;
			},

		},
        methods: {
			recupereDefis() {
				console.log("Récupération des défis de la commune");
				let titre = "Les défis de votre commune ont été chargés dans vos défis";
				if (this.$store.state.selectedEquipe.commune.length > 0) {
					console.log("defis de la commune : "+this.$store.state.defisCommune);
					if (this.$store.state.defisCommune.length > 0) {
						console.log("R2cupération des défis OK");
						this.$store.state.nosDefis = this.$store.state.defisCommune;
					}
					else {
						console.log("pas de défis pour la commune en cours");
						titre = "Aucun défi à récupérer";
					}
				}
				else {
					console.log("pas de commune selectionné");
					titre = "Veuillez renseigner votre commune pour pouvoir récupérer les défis";
				}
				alert({
					  title: "Récupération des défis",
					  message: titre,
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
					});
			},
            affichageCat() {
				console.log("liste des challenges");
				this.$store.state.selectedCommune = null;
                this.$navigateTo(listeChallengesCat);
            },
			affichageCatCommune() {
				console.log("liste des challenges");
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(listeChallengesCat);
			},
			getDefi(item) {
				console.log("affichage du defi : "+item.nom + ": "+item.id);
				this.$store.state.selectedCategorie = this.categorie;
                this.$store.state.selectedDefi = item;
				this.$store.state.selectedCommune = null;
                this.$navigateTo(affichageDefi);
			},
			getDefiCommune(item) {
				console.log("affichage du defi : "+item.nom + ": "+item.id);
				this.$store.state.selectedCategorie = this.categorie;
                this.$store.state.selectedDefi = item;
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(affichageDefi);
			},
			
			getDefiNom(idDefi) {
				var currentDefi = this.$store.state.defis.filter(function(elem) {
					console.log(idDefi+ "---" + elem.id); 
					if (idDefi == elem.id) return elem.nom;
				});
				if(currentDefi.length > 0) {
					return currentDefi[0].Value;
				}
				return "Pas de nom associé au défi";
			},
        },
		
    };
</script>

<style>
.recup {
	margin : 20px;
}
</style>