//PATH: backend\routes\task.route.js

import express from 'express';
import { Task } from '../models/task.model.js';
import { protectRoute } from '../middleware/auth.middleware.js'; // [추가] 인증 미들웨어 import

const router = express.Router();

// [수정] 이 라우터의 모든 경로에 protectRoute 미들웨어를 적용합니다.
// 이제부터 /api/tasks/ 로 들어오는 모든 요청은 토큰 검사를 거치게 됩니다.
router.use(protectRoute);

// GET /api/tasks - 로그인한 사용자의 모든 task 가져오기
router.get('/', async (req, res) => {
  try {
    const date = req.query.date;
    // [수정] DB에서 모든 task를 찾는 대신, 현재 로그인한 사용자의 task만 찾습니다.
    const tasks = await Task.find({ user: req.user.userId, date: date });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - 로그인한 사용자의 task 생성하기
router.post('/', async (req, res) => {
  try {
    const { name, description, date } = req.body.task; // 클라이언트가 task 객체 안에 담아 보낸다고 가정
    console.log(date)
    const userId = req.user.userId; // 미들웨어가 넣어준 사용자 ID

    // [수정] task를 생성할 때, user 필드에 현재 로그인한 사용자의 ID를 넣어줍니다.
    const createdTask = await Task.create({ name, description, date, user: userId });
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - 로그인한 사용자의 특정 task 수정하기
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // [수정] 업데이트 로직을 파이프라인으로 변경
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId }, // 조건: 업데이트할 문서를 찾습니다.
      [ // 업데이트 파이프라인 시작
        {
          $set: {
            completed: { $not: "$completed" } // completed 필드의 현재 값($completed)을 반전(!, not)시킵니다.
          }
        }
      ], // 업데이트 파이프라인 종료
      { new: true } // 옵션: 업데이트된 후의 문서를 반환합니다.
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found or permission denied' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.put('/undo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      [
        {
          $set: {
            completed: { $not: "$completed" }
          }
        }
      ],
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found or permission denied' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
})

// DELETE /api/tasks/:id - 로그인한 사용자의 특정 task 삭제하기
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // [수정] task를 ID와 사용자 ID로 함께 조회하여 권한을 확인하고, 한 번에 삭제합니다.
    const result = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!result) {
      // task가 없거나, 다른 사람의 task일 경우 null이 반환됨
      return res.status(404).json({ error: 'Task not found or permission denied' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;