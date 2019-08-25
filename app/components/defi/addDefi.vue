<template>
    <page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
					<Label row="0" col="0" :text="titreAjoutDefi" class="catTitle"/>
					
					
				<FloatLabel placeholder="Nom du défi" label="Nom" :valeur="defi.nom" @updateValeur="updateDefiNom"/>
				<FloatLabel placeholder="Description courte" label="Nom" :valeur="defi.descriptionCourte" @updateValeur="updateDefiDescriptionCourte"/>
				<FloatLabel placeholder="Description longue" label="Nom" :valeur="defi.descriptionLongue" @updateValeur="updateDefiDescriptionLongue"/>
						
					
				<Button text="Enregistrer" @tap="saveDefi" />
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
	</page>
	
	
</template>

<script>
	
	import listDefisCat from "./listDefisCat";
	export default {
		computed: {
			titreAjoutDefi() {
				return this.$store.state.selectedCategorie.nom+ ": Ajout défi";
			},
        },
        data() {
            return {
				defi: {
					id : 0,
					nom : "",
					description_courte: "" , 
					description_longue : "",
					reglementation : "",
					bareme : ""
				},
            }
        },
		mounted() {
			
        },
		methods: {
			saveDefi() {
				console.log("on sauvegarde le defi : "+this.defi.id +" : "+this.defi.nom+" : "+this.$store.state.selectedCategorie.nom);
			    this.$store.dispatch("insertDefi", this.defi);
				this.$navigateTo(listDefisCat);
            },
			updateDefiNom(defiName) {
				this.defi.nom = defiName;
			},
			updateDefiDescriptionCourte(defiDescCourte) {
				this.defi.description_courte = defiDescCourte;
			},
			updateDefiDescriptionLongue(defiDescLongue) {
				this.defi.description_longue = defiDescLongue;
			},
		},
    };
</script>

<style>
.catTitle {
	color : black;
	font-weight: bold;
	font-size: 30;
}
.catNBDefis {
	color : white;
	font-weight: bold;
	font-size: 15;
}

</style>