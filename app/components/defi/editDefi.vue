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
						<Image row="0" col="2" class="actionButton" src="~/assets/icons/confirm.png" @tap="saveDefi"/>
					</GridLayout>
					<Label text="Catégorie" class="label"/>
					<Label :text="titreCategorie" class="valeur"/>
					<Label class="label" ref="labelDefiNom" text="Nom du défi" />
					<TextField class="textfield" hint="Ex : le jonglage infernal" v-model="currentDefi.nom"/>
					<Label class="label" ref="labelDefiDescCourte" text="Description courte" />
					<TextField class="textfield" hint="Champ affiché avec le titre dans les listes" v-model="currentDefi.description_courte"/>
					<Label class="label" ref="labelDefiDescLongue" text="Description complète" />
					<TextView class="textView" hint="Descritpion détaillée visible dans la fiche du défi" v-model="currentDefi.description_longue"/>
					<Label class="label" ref="labelDefiReglementation" text="Règlementation" />
					<TextView class="textView" hint="Description des règles du jeu" v-model="currentDefi.reglementation"/>
					<Label class="label" ref="labelDefiBareme" text="Bareme" />
					<TextView class="textView" hint="Comment calculer le score" v-model="currentDefi.bareme"/>
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
				currentDefi: {
					id : "",
					nom : "",
					description_courte : "",
					description_longue : "",
					reglementation : "",
					bareme : "",
					categorie : "",
					deleted : false
				},
            }
        },
		mounted() {
			// recueration du defi s"il existe 
			if (this.$store.state.selectedDefi) {
				this.currentDefi = this.$store.state.selectedDefi;				
			}
			if (this.$store.state.selectedCategorie) {
				this.currentDefi.categorie = this.$store.state.selectedCategorie;				
			}
			
        },
		methods: {
			saveDefi() {
				console.log("sauvegarde du defi");
				if (this.$store.state.selectedDefi) {
					console.log("on update le defi : "+JSON.stringify(this.currentDefi));
					this.$store.dispatch("updateDefi", {"defi" : this.currentDefi});
				}
				else {
					console.log("on ajoute le defi : "+JSON.stringify(this.currentDefi));
					this.$store.dispatch("insertDefi",{"defi" : this.currentDefi});
				}
				this.$store.state.updateDefi = true;
				this.$navigateTo(listCat);
            },
		},
    };
</script>

<style>
</style>