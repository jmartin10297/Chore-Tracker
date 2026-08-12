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

        return false;

    }

    return true;
}

async function getAllChores() {

    const { data, error } = await supabaseClient
        .from("chores")
        .select("*")

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

async function getActiveChores() {

    const { data, error } = await supabaseClient
        .from("chores")
        .select("*")
        .eq("active", true);

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

async function deleteChoreFromSupabase(choreId) {

    console.log("Attempting to delete chore:", choreId);

    const { error } = await supabaseClient
        .from("chores")
        .delete()
        .eq("id", choreId);

    if (error) {
        console.error("DELETE ERROR:", error);
        return false;
    }

    console.log("Delete successful");

    return true;
}

async function addChoreToSupabase(chore) {

    const { data, error } = await supabaseClient
        .from("chores")
        .insert({
            name: chore.name,
            assignedTo: chore.assignedTo,
            dueDate: chore.dueDate,
            active: chore.active,
            intervalDays: chore.intervalDays,
            rotationGroup: chore.rotationGroup,
            completed: chore.completed,
            lastCompleted: chore.lastCompleted
        })
        .select()
        .single();

    if (error) {
        console.error("INSERT ERROR:", error);
        return false;
    }

    console.log("Successfully added chore:", data);

    return true;
}