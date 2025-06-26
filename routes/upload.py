from fastapi import APIRouter, UploadFile, File
import os
import shutil
import glob

router = APIRouter()

DATA_DIR = './data'

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    os.makedirs(DATA_DIR, exist_ok=True)
    delete_all_pdfs_in_data()
    file_location = os.path.join(DATA_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": f"{file.filename} 업로드 완료!", "filename": file.filename}




def delete_all_pdfs_in_data():
    pdf_files = glob.glob('./data/*.pdf')
    for pdf_file in pdf_files:
        try:
            os.remove(pdf_file)
            print(f"Deleted: {pdf_file}")
        except Exception as e:
            print(f"Error deleting {pdf_file}: {e}")