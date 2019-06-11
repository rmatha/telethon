<template>
    <page>
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
					<Label row="0" col="0" text="Edition Catégorie " class="catTitle"/>
					
					
				<FloatLabel placeholder="Catégorie en cours" label="ID de la catégorie" :valeur="categorie.id"/>
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
        },
        props: ['categorie'],
		data() {
            return {
				defi: {
					id : 0,
					nom : "",
					description_courte: "" , 
					description_longue : "",
					reglementation : "",
					bareme : "",
					categorie : this.categorie.id
				},
            }
        },
		mounted() {
			
        },
		methods: {
			saveDefi() {
				console.log("on sauvegarde le defi : "+this.defi.id +" : "+this.defi.nom+" : "+this.defi.categorie);
			    this.$store.dispatch("insertDefi", this.defi);
				this.$navigateTo(listDefisCat, { props: {categorie: this.categorie}});
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