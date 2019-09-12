<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<Label text="Catégorie" class="label"/>
				<Label :text="titreCategorie" class="valeur"/>
				<FloatLabel placeholder="Nom du défi" label="Nom" :valeur="defi.nom" @updateValeur="updateDefiNom"/>
				<FloatLabel placeholder="Description courte" label="Nom" :valeur="defi.description_courte" @updateValeur="updateDefiDescriptionCourte"/>
				<FloatLabel placeholder="Description longue" label="Nom" :valeur="defi.description_longue" @updateValeur="updateDefiDescriptionLongue"/>
						
					
				<Button text="Enregistrer" @tap="saveDefi" />
			</StackLayout>
		</DockLayout>
		
	</page>
	
	
</template>

<script>
	
	import listDefisCat from "./listDefisCat";
	import listCat from "../categorie/listCategorie";
	
	export default {
		computed: {
			titreCategorie() {
				var categories = this.$store.state.categories.filter(item => {
					return item.id == this.$store.state.selectedCategorie.id;
				});
				if (categories.length > 0) {
					return categories[0].nom;
				}
				return "Pas de catégorie sélectionnée";
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
				categories : null,
            }
        },
		mounted() {
			// recueration du defi s"il existe 
			if (this.$store.state.selectedDefi) {
				console.log("editDefi : mounted : on récupère le defi en cours :"+this.$store.state.selectedDefi.categorie);
				this.defi.id = this.$store.state.selectedDefi.id;
				this.defi.nom = this.$store.state.selectedDefi.nom;
				this.defi.description_courte = this.$store.state.selectedDefi.description_courte;
				this.defi.description_longue = this.$store.state.selectedDefi.description_longue;
				// recuperation du nom de la categorie pour le defi sélectionné
				var $categories = this.$store.state.categories.filter(item => {
					console.log("editDefi : mounted : filter : "+ item.id +" ---"+this.$store.state.selectedDefi.categorie);
					return item.id == this.$store.state.selectedDefi.categorie;
				});
				console.log("EditDefi : mounted : categories : "+JSON.stringify($categories));
				if ($categories.length > 0) {
					this.categorie = $categories[0];
				} 
				else {
					alert({
						  title: "Modification du défi",
						  message: "La catégorie n'est pas définie pour ce défi. Il faut le supprimer !",
						  okButtonText: "OK"
						}).then(() => {
							this.$navigateTo(listCat);
						});
				}
				
			}
			else {
				console.log("editDefi : mounted : création d'un nouveau défi :");
				if (this.$store.state.selectedCategorie) {
						// récupération de la catégorie en cours
					this.categorie = this.$store.state.selectedCategorie
				}
				else {
					alert({
							  title: "Modification du défi",
							  message: "La catégorie n'est pas définie ! Retour à la liste des catégories!",
							  okButtonText: "OK"
							}).then(() => {
								this.navigateTo(listCat);
							});
				}
			}
			
        },
		methods: {
			saveDefi() {
				console.log("on sauvegarde le defi : "+this.defi.id +" : "+this.defi.nom+" : "+this.$store.state.selectedCategorie.nom);
			    this.$store.dispatch("insertOrUpdateDefi", this.defi);
				this.$store.state.updateDefi = true;
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
</style>