<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<ScrollView dock="center" >
				<StackLayout>
					<GridLayout rows="auto" columns="*,50">
						<Label row="0" col="0" text="Ajout d'un defi" class="label"/>
						<Image v-if="$store.state.updateCategorie" row="0" col="1" class="actionButton" src="~/assets/icons/save.png" @tap="saveDefi"/>
					</GridLayout>
					<Label text="Catégorie" class="label"/>
					<Label :text="titreCategorie" class="valeur"/>
					<Label class="label" ref="labelDefiNom" text="Nom du défi" />
					<TextField class="textfield" hint="Ex : le jonglage infernal" v-model="defi.nom"/>
					<Label class="label" ref="labelDefiDescCourte" text="Description courte" />
					<TextField class="textfield" hint="Champ affiché avec le titre dans les listes" v-model="defi.description_courte"/>
					<Label class="label" ref="labelDefiDescLongue" text="Description complète" />
					<TextView class="textView" hint="Descritpion détaillée visible dans la fiche du défi" v-model="defi.description_longue"/>
					<Label class="label" ref="labelDefiReglementation" text="Règlementation" />
					<TextView class="textView" hint="Description des règles du jeu" v-model="defi.reglementation"/>
					<Label class="label" ref="labelDefiBareme" text="Bareme" />
					<TextView class="textView" hint="Comment calculer le score" v-model="defi.bareme"/>
					<Button text="Enregistrer" @tap="saveDefi" />

				</StackLayout>
			</ScrollView>
		</DockLayout>
		
	</page>
	
	
</template>

<script>
	
	import listDefisCat from "./listDefisCat";
	import listCat from "../categorie/listCategorie";
	
	export default {
		computed: {
			titreCategorie() {
				
				if (this.$store.state.selectedCategorie) {
					return this.$store.state.selectedCategorie.nom;
				}
				return "Pas de catégorie sélectionnée";
			},
        },
        data() {
            return {
				defi: {
					nom : "",
					description_courte: "" , 
					description_longue : "",
					reglementation : "",
					bareme : "",
					deleted : 0,
					categorie : null,
				},
            }
        },
		mounted() {
			// recueration du defi s"il existe 
			if (this.$store.state.selectedDefi) {
				console.log("editDefi : mounted : on récupère le defi en cours :"+this.$store.state.selectedDefi.categorie);
				this.defi = this.$store.state.selectedDefi;
				
				// recuperation du nom de la categorie pour le defi sélectionné
				if (!this.$store.state.selectedCategorie) {
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
					this.defi.categorie = this.$store.state.selectedCategorie;
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
				console.log("on sauvegarde le defi : "+this.defi.nom+" : "+this.$store.state.selectedCategorie.nom);
				if (this.$store.state.selectedDefi) {
					this.$store.dispatch("updateDefi", {"defi" : this.defi});
				}
				else {
					this.$store.dispatch("insertDefi",{"defi" : this.defi});
				}
				this.$store.state.updateDefi = true;
				this.$navigateTo(listDefisCat);
            },
		},
    };
</script>

<style>
</style>