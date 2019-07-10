<template>
    <!-- Bottom navigation -->
	<AbsoluteLayout  :class="[{ slide: active },{slideDown : !active}]" ref="abso">
		<StackLayout class="stack">
			<GridLayout  rows="auto" columns="*, *, *" >
				<Image src="~/assets/icons/equipe.jpg" @tap="navProfil" row="0" col="0" />
				<Image src="~/assets/icons/challenges.png" @tap="navChallenges" row="0" col="1" />
				<Image src="~/assets/icons/Star-Red.png" @tap="navResultats" row="0" col="2" />
			</GridLayout>
			<StackLayout >
				<Label text="ca marche" />
				<Label text="ca marche" />
				<Label text="ca marche" />
			</StackLayout>
		</StackLayout>
	</AbsoluteLayout>

</template>

<script>
    import profil from "../equipe/equipe";
    import mesDefis from "../defi/mesDefis";
    import resultats from "../score/resultats";
	
	
    export default {
        data() {
            return {
                active : false,
            };
        },
        computed: {
            navigationButtonClasses() {
                return component => ({
                    fa: true,
                    "nav-btn": true,
                });
            }
        },
        
		methods: {
			navProfil() {
				this.$navigateTo(profil);
			},
			navChallenges() {
				//this.$navigateTo(mesDefis);
				this.active = !this.active;
				console.log("valeur de active : "+this.active);
			},
			navResultats() {
				this.$navigateTo(resultats);
			},
		},
		components: {
            profil,
			mesDefis,
			resultats,
		}
    };
</script>


<style>
.mesBoutons {
	height: 75%; /* approximate max height */
}

.slide {
	margin-top : 500px;
}



@keyframes example {
    from { background-color: red }
    to { background-color: green }
}

.slideDown {
    animation-name: example;
    animation-duration: 4s;
    animation-fill-mode: forwards;
	margin-top : 200px;
}


.stack{
	background-color : #152698;
	width : 100%;
}

.slide {
	/*height : 50px;*/
}

</style>