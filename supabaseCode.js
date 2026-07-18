const supabaseUrl = "https://pukowvhotbaxtlilfuah.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1a293dmhvdGJheHRsaWxmdWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NjI0NTcsImV4cCI6MjA5ODMzODQ1N30.b_g2xAAxn1DEyP7njirPsKE9QCQsaD34Molz49slV2s";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function updateChoreInSupabase(chore) {

    const { error } = await supabaseClient
        .from("chores")
        .update({
            name: chore.name,
            assignedTo: chore.assignedTo,
            dueDate: chore.dueDate,
            active: chore.active,
            intervalDays: chore.intervalDays,
            rotationGroup: chore.rotationGroup,
            completed: chore.completed,
            lastCompleted: chore.lastCompleted
        })
        .eq("id", chore.id);

    if (error) {
        console.error("UPDATE ERROR:", error);
    }
}

async function getAllChores() {

    const { data, error } = await supabaseClient
        .from("chores")
        .select("*");

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}