<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<ScrollView orientation="horizontal">
					<StackLayout width="100%" height="100%">
						<GridLayout rows="auto" columns="*,50,50">
							<Label row="0" col="0" text="Liste des catégories" class="label"/>
							<Image v-if="$store.state.updateCategorie" row="0" col="1" class="actionButton" src="~/assets/icons/save.png" @tap=""/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="addCat()"/>
							
						</GridLayout>
						<ListView for="item in $store.state.categories" height="100%" > 
						  <v-template>
							<GridLayout rows="*" columns="*" margin="0"  @tap="selectCategorie(item)">
								<Image :src="lienCat(item.nom)" height="25%" />
								<GridLayout verticalAlignment="top" rows="auto,auto" columns="auto,*,auto" >
									<Label row="0" col="0" colspan="2" :text="item.nom" class="catTitle" />
									<Label row="1" col="0" colspan="2" :text="nbDefis(item)" class="catNBDefis" />
									
								</GridLayout>
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
	
	import addCategorie from "./addCategorie";
	import modal from "../include/modal";
	import listDefisCat from "../defi/listDefisCat";
	
	export default {
		computed: {
            lienCat() {
                return name => ("~/assets/challengeCat/" + name + ".jpg");
            },
			isAdmin(){
				if (this.$store.state.currentEquipe.admin > 1){
					return true;
				}
				return false;
			},



			
        },
        data() {
            return {
				selectedCategorie : null,
            }
        },
		mounted() {
			console.log("listCategorie : mounted : categories "+JSON.stringify(this.$store.state.categories));
			console.log("listCategorie : mounted : defis "+JSON.stringify(this.$store.state.defis));

        },
		methods: {
			showActions(itemRef) {
				this.selectedCategorie = itemRef;
				//console.log("listCategorie showActions : nouvelleCategorie :"+this.selectedCategorie);
			},
			isShowActions(itemRef) {
				//console.log("listCategorie isShowActions : itemRef "+itemRef);
				//console.log("listCategorie isShowActions : this.selectedCategorie "+this.selectedCategorie);
				if (itemRef == this.selectedCategorie) {
					return true;
				};
				return false;
			},
			nbDefis(itemRef) {
				//console.log("listCategorie state.defis :"+JSON.stringify(this.$store.state.defis));
				//console.log("listCategorie itemRef:"+JSON.stringify(itemRef));
				
				var nbDefisCat = this.$store.state.defis.filter(item => {
					console.log("listCategorie : "+item.categorie.nom +" : "+itemRef.nom); 
					return item.categorie.nom == itemRef.nom;
				});
				return "Nombre de défis : "+nbDefisCat.length;
			},
			addCat() {
				//console.log("Ajout d'une catégorie");
				this.$store.state.selectedCategorie = null;
				this.$navigateTo(addCategorie);
			},
			
            selectCategorie(categorie) {
				//console.log("listCategorie : ouverture des defis pour la categorie : "+categorie.nom);
				this.$store.state.selectedCategorie = categorie;
				this.$navigateTo(listDefisCat);
			},
			
		},
    };
</script>

<style>
.catTitle {
	color : white;
	font-weight: bold;
	font-size: 30;
}
.catNBDefis {
	color : white;
	font-weight: bold;
	font-size: 15;
}

</style>