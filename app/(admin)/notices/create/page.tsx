import CreateNoticeForm from "./CreateNoticeForm";


export default function CreateNoticePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-black font-outfit text-primary">Create New Notice</h1>
                <p className="text-sm text-slate-600 mt-1">Fill in the details to create a new notice or announcement</p>
            </div>
            <CreateNoticeForm />
        </div>
    );
}
