<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<StackLayout>
				<GridLayout  rows="auto" columns="*,50,50,50">
					<Label row="0" col="0" class="titre mb50" :text="$store.state.selectedCategorie.nom" textAlignment="center" 
					<Image row="0" col="1" v-if="$store.state.updateDefi" class="actionButton" src="~/assets/icons/upload.png" @tap="uploadDefis"/>
					<Image row="0" col="2" class="actionButton" src="~/assets/icons/delete.png" @tap="deleteCategorie"/>
					<Image row="0" col="3" class="actionButton" src="~/assets/icons/modify.png" @tap="editCat"/>
				</GridLayout>
				<GridLayout  rows="auto" columns="*,50">
					<Label row="0" col="0" text="Liste des défis" textAlignment="center" fontSize="24"/>
					<Image row="0" col="1" v-if="$store.state.isAdmin" src="~/assets/icons/add-256.gif" @tap="addDefi"/>
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
	import editDefi from "./editDefi";
	import store from "../store/teleStore.js";
	import editCategorie from "../categorie/addCategorie";
	
	export default {
		computed: {
			defisCat () {
				return this.$store.state.defis.filter(item => {
					console.log("ListDefiCat : defiCat :"+item.categorie.nom+" : "+this.$store.state.selectedCategorie.nom); 
					return item.categorie.nom == this.$store.state.selectedCategorie.nom;
				});
			},
		},
        data() {
            return {
				
			}
        },
		mounted() {
			
			
        },
		methods: {
			getDefi(item) {
				console.log("affichage du defi");
				this.$store.state.selectedDefi = {};
				this.$store.state.selectedDefi.defi = item;
				console.log("affichage du defi"+JSON.stringify(item));
				this.$navigateTo(affichageDefi);
			},
			addDefi() {
				this.$store.state.selectedDefi = null;
				this.$navigateTo(editDefi);
			}, 
			editCat() {
				this.$navigateTo(editCategorie);
				
			},
			deleteCategorie() {
				// affichage du modal de confirmation
				confirm({
				  title: "Confirmation",
				  message: "Voulez-vous supprimer la catégorie "+this.$store.state.selectedCategorie.nom+" ?",
				  okButtonText: "oui",
				  cancelButtonText: "non"
				}).then(result => {	console.log(result);
					if (result) {
						console.log("on supprime !");
						this.$store.dispatch("deleteCategorie");
						this.$store.state.updateCategorie = true;
					}
					else {
						console.log("pas touche !");
					}
				});
			},
			uploadDefis() {
				confirm({
				  title: "Sauvegarde des défis ",
				  message: "Confirmez-vous la sauvegarde des modifications faites sur les défis (suppressions, modifications et ajouts)?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
				  console.log(result);
				  if (result) {
					console.log("On sauvegarde sur le serveur");
					console.log("defis ALL:"+JSON.stringify(this.$store.state.defis));
					this.defisUpdated = this.$store.state.defis.filter(item => {
						console.log("defi a upload :"+item.nom+" : "+item.updated); 
						return item.updated == "1";
					});
					console.log("mesDefis : uploadDefi : nombre de défis à MAJ : "+this.defisUpdated.length);
					console.log("mesDefis : uploadDefi : "+JSON.stringify(this.defisUpdated));
					
					axios
						  .post('https://www.telethon.citeyen.com/public/api/defis/upload', {
							defis : this.defisUpdated,
						  })
						  .then(response => {
							console.log("update OK");
							alert({
							  title: "Récupération des défis",
							  message: "Mise à jour des défis à partir du serveur",
							  okButtonText: "OK"
							}).then(() => {
								axios
									.get('https://telethon.citeyen.com/public/api/defis/version')
									.then(response => {
										var versionServeur = response.data.version
										axios
										  .get('https://telethon.citeyen.com/public/api/defis/list')
										  .then(responseList => {
											console.log("Chargement des  defis en base : "+JSON.stringify(responseList.data));
											this.$store.dispatch("reloadDefis",{data : responseList.data,version : versionServeur});
										  });
									})
							});
						})
						.catch(error => {
							console.log("updatete KO : "+error.response);
							alert({
							  title: "Problème de sauvegarde",
							  message: "La sauvegarde n'est pas possible actuellement. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
							  okButtonText: "OK"
							}).then(() => {
							  console.log("Alert dialog closed");
							  this.$navigateTo(mesDefis);
							});
						})
					
					}
				});
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