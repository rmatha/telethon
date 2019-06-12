<template>
    <page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<ScrollView>
					<StackLayout class="m-20">
						<StackLayout orientation="horizontal" backgroundcolor="#562389">
							<Label width="85%" class="m-b-20 titreTelethon" text="Mes challenges" textWrap="true" />
							<Button width="15%" class="fa fa-2x red" :text="'fa-plus' | fonticon"  backgroundColor="#ffffff" @tap="affichageCat"/>
						</StackLayout>
						
					</StackLayout>
				</ScrollView>
				<Label text="liste de mes challenges à venir"/>
				
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
		
	</page>
</template>

<script>
	import listeChallengesCat from "./categorie/listCategorie";
	
	export default {
        methods: {
            affichageCat() {
				console.log("liste des challenges");
                this.$navigateTo(listeChallengesCat);
            }
        },
    };
</script>

<style>
</style>