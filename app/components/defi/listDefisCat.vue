<template>
    <page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
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
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
	</page>
	
	
</template>

<script>
	import affichageDefi from "./affichageDefi";
	import addDefi from "./addDefi";
	
	export default {
		props: ['commune','categorie'],
		computed: {
			defisCat () {
				return this.$store.state.defis.filter(item => {
					console.log("defiCat :"+item.categorie+" : "+this.categorie.id); 
					return item.categorie == this.categorie.id;
				});
			},
		},
        data() {
            return {
				
			}
        },
		mounted() {
			this.$store.dispatch("queryDefis", this.categorie);
			
        },
		methods: {
			getDefi(item) {
				console.log("affichage du defi");
				this.$navigateTo(affichageDefi, { props: {defi: item, categorie: this.categorie, commune : this.commune}});
			},
			addDefi(categorie) {
				this.$navigateTo(addDefi, { props: {categorie: this.categorie}});
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