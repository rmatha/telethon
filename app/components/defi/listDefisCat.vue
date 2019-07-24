<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<StackLayout row="1" col="0" colSpan="3">
				<Label row="0" col="0" text="categorieNom" textAlignment="center" fontSize="24"/>
				<GridLayout rows="auto" columns="*,50">
					<Label row="0" col="0" text="Liste des défis" textAlignment="center" fontSize="24"/>
					<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="addDefi(categorie)"/>
					
				</GridLayout>
				<ListView key="$store.state.defis" for="item in defisCat" height="100%" >
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
			</StackLayout>
			</StackLayout>
		</DockLayout>
	</page>
	
	
</template>

<script>
	import affichageDefi from "./affichageDefi";
	import addDefi from "./addDefi";
	import store from "../store/teleStore.js";
	
	export default {
		computed: {
			defisCat () {
				return this.$store.state.defis.filter(item => {
					console.log("defiCat :"+item.categorie+" : "+this.$store.state.selectedCategorie.id); 
					return item.categorie == this.$store.state.selectedCategorie.id;
				});
			},
		},
        data() {
            return {
				
			}
        },
		mounted() {
			this.$store.dispatch("queryDefis", this.$store.state.selectedCategorie);
			
        },
		methods: {
			getDefi(item) {
				console.log("affichage du defi");
				this.$store.state.selectedDefi = item;
				this.$navigateTo(affichageDefi);
			},
			addDefi(categorie) {
				this.$navigateTo(addDefi);
			}, 
		},
    };
</script>

<style>
.defiTitle {
	color : black;
	font-weight: bold;
	font-size: 15px;
}
.defiDescription {
	color : black;
	font-size: 10px;
	font-weight: normal;
	
}

</style>