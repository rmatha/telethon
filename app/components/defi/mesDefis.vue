<template>
    <page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<ScrollView>
					<StackLayout class="m-20">
						<StackLayout orientation="horizontal" backgroundcolor="#562389">
							<Label width="85%" class="m-b-20 titreTelethon" text="Mes challenges" textWrap="true" />
							<Image src="~/assets/icons/add-256.gif" width="15%" @tap="affichageCat"/>
						</StackLayout>
						
					</StackLayout>
				</ScrollView>
				<Label text="liste des challenges de l'équipe"/>
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
				
				
				
				
				<StackLayout v-if="isAdmin">
					<ScrollView >
						<StackLayout class="m-20">
							<StackLayout orientation="horizontal" backgroundcolor="#562389">
								<Label width="85%" class="m-b-20 titreTelethon" text="Challenges de ma commune" textWrap="true" />
								<Image src="~/assets/icons/add-256.gif" width="15%" @tap="affichageCatCommune"/> 
							</StackLayout>
							
						</StackLayout>
					</ScrollView>
					<Label :text="sousTitreCommune"/>
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
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
		
	</page>
</template>

<script>
	import listeChallengesCat from "../categorie/listCategorie";
	import affichageDefi from "./affichageDefi";
	
	export default {
		computed: {
			sousTitreCommune() {
				return "Liste des challenges pour la commune : "+this.$store.state.currentEquipe.commune;
			},

            isAdmin(){
				if (this.$store.state.currentEquipe.admin > 0){
					return true;
				}
				return false;
			},

			isAdmin2(){
				if (this.$store.state.currentEquipe.admin > 1){
					return true;
				}
				return false;
			},

		},
        methods: {
            affichageCat() {
				console.log("liste des challenges");
                this.$navigateTo(listeChallengesCat);
            },
			affichageCatCommune() {
				console.log("liste des challenges");
                this.$navigateTo(listeChallengesCat, { props: {commune : this.$store.state.currentEquipe.commune}});
			},
			getDefi(item) {
				console.log("affichage du defi : "+item.nom + ": "+item.id);
				this.$navigateTo(affichageDefi, { props: {defi: item, categorie: this.categorie}});
			},
			getDefiCommune(item) {
				console.log("affichage du defi : "+item.nom + ": "+item.id);
				this.$navigateTo(affichageDefi, { props: {defi: item, categorie: this.categorie, commune : this.$store.state.currentEquipe.commune}});
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
</style>