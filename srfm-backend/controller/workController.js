import WorkModel from "../models/workModel.js";

const addWork = async (req, res) => {
  try {
    const {
      workDescription,
      customerName,
      customerPhone,
      customerAddress,
      vehicleName,
      vehicleModel,
    } = req.body;

    const work = await WorkModel.create({
      workDescription,
      customerName,
      customerPhone,
      customerAddress,
      vehicleName,
      vehicleModel,
    });

    res.json({ success: true, message: "Work added successfully!", work });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getAllWork = async (req, res) => {
  try {
    const { status, search } = req.query;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filter = { createdAt: { $gte: oneYearAgo } };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { workDescription: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
      ];
    }

    const works = await WorkModel.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, works });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getPendingWork = async (req, res) => {
  try {
    const works = await WorkModel.find({ status: "Pending" }).sort({
      createdAt: -1,
    });
    res.json({ success: true, works });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const markWorkDone = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReceived, outsideExpense, remainingPayment, completionDate } =
      req.body;

    const work = await WorkModel.findByIdAndUpdate(
      id,
      {
        status: "Done",
        paymentReceived: Number(paymentReceived) || 0,
        outsideExpense: Number(outsideExpense) || 0,
        remainingPayment: Number(remainingPayment) || 0,
        completionDate: new Date(completionDate || Date.now()),
      },
      { new: true }
    );

    if (!work) {
      return res.json({ success: false, message: "Work not found" });
    }

    res.json({ success: true, message: "Work marked as done!", work });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const markWorkCancelled = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationRemarks } = req.body;

    const work = await WorkModel.findByIdAndUpdate(
      id,
      {
        status: "Cancelled",
        cancellationDate: new Date(),
        cancellationRemarks: cancellationRemarks || "",
      },
      { new: true }
    );

    if (!work) {
      return res.json({ success: false, message: "Work not found" });
    }

    res.json({ success: true, message: "Work cancelled!", work });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addWork, getAllWork, getPendingWork, markWorkDone, markWorkCancelled };
