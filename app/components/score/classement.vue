<template>
    <Page class="page" actionBarHidden="true">
	  <DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<StackLayout row="1" col="0" colSpan="3">
				<GridLayout rows="auto" columns="*, auto">
					<Label row="0" col="0" class="titleResultat" text="Classements" />
					<Label row="0" col="1" text="Rafraichir" @tap="rafraichir" />
				</GridLayout>
				<Label class="label" text="Classement sur la commune" />
				<Label class="label" text="Classement sur le département" />
				
				
			</StackLayout>
		</StackLayout>
		</DockLayout>
	</page>
	
	
</template>

<script>
	export default {
		computed: {
			
        },
        props: [],
		data() {
            return {
				scoreEquipe : []
            }
        },
		mounted() {
			//console.log("lancement du classement");
			this.rafraichir();
        },
		methods: {
			
		},
    };
</script>

<style>
.titleResultat {
	color : black;
	font-weight: bold;
	font-size: 30;
}
.moyenneResultat {
	color : black;
	font-weight: bold;
	font-size: 45;
	text-align: center;
}

</style>