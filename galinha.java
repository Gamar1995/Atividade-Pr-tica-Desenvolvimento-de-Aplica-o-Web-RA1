public class GalinhaPintadinha {

    private static void cantar(String verso, long pausaMs) {
        System.out.println(verso);
        try {
            Thread.sleep(pausaMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static void main(String[] args) {
        System.out.println("\n🎶 --- A GALINHA PINTADINHA --- 🎶\n");

        // Estrofe 1
        cantar("A Galinha Pintadinha", 1100);
        cantar("E o Galo Carijó,", 1100);
        cantar("A Galinha usa saia", 1100);
        cantar("E o Galo paletó!\n", 1800);

        // Estrofe 2
        cantar("A Galinha ficou doente,", 1200);
        cantar("E o Galo nem ligou...", 1200);
        cantar("E os pintinhos foram correndo", 1200);
        cantar("Pra chamar o seu doutor!\n", 1800);

        // Estrofe 3
        cantar("O doutor era o Peru (glu, glu!)", 1300);
        cantar("A enfermeira era um Urubu (uh, uh!)", 1300);
        cantar("E a agulha da injeção...", 1300);
        cantar("Era a pena de um Pavão! (ui, ui!)\n", 2000);

        // Refrão clássico
        cantar("Pó, pó, pó, pó, pó...", 600);
        cantar("Pó, pó, pó, pó, pó...", 600);
        cantar("Pó, pó, pó, pó, pó...", 600);
        cantar("Pó, pó, pó, pó, pó!\n", 1000);
    }
}