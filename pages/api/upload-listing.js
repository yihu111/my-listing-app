import formidable from 'formidable';
import fs from 'fs';
import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File upload failed' });

    const { title, description, price, category } = fields;
    const image = files.image;

    const fileBuffer = fs.readFileSync(image.filepath);
    const fileName = `listing-${Date.now()}-${image.originalFilename}`;

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, fileBuffer, {
        contentType: image.mimetype,
      });

    if (uploadError) return res.status(500).json({ error: 'Image upload failed' });

    const imageUrl = supabase.storage
      .from('your-bucket-name')
      .getPublicUrl(fileName).data.publicUrl;

    const { error: insertError } = await supabase.from('listings').insert([
      {
        title,
        description,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
      },
    ]);

    if (insertError) return res.status(500).json({ error: 'Database insert failed' });

    res.status(200).json({ message: 'Listing uploaded successfully', imageUrl });
  });
}
